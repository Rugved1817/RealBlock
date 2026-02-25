
import { Router } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, BaseMessage, ToolMessage } from '@langchain/core/messages';
import { StateGraph, END, START } from '@langchain/langgraph';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import prisma from '../../prisma/client.js';
import { authService } from '../auth/auth.service.js';
import { propertyService } from '../property/property.service.js';
import { MongoClient } from 'mongodb';

const aiRouter = Router();

// --- TOOLS ---

// Market Agent Tool: Search Properties
const searchPropertiesTool = tool(
    async ({ query, type, location }) => {
        console.log(`Searching properties with query: ${query}, type: ${type}, location: ${location}`);

        const whereClause: any = {};

        // Handle Type Filter (Enum mapping)
        if (type) {
            const normalizedType = type.toUpperCase();
            // Check if it matches known enums (COMMERCIAL, WAREHOUSING, RESIDENTIAL)
            if (['COMMERCIAL', 'WAREHOUSING', 'RESIDENTIAL'].includes(normalizedType)) {
                whereClause.type = normalizedType;
            } else {
                // If not an exact enum match (e.g. "Office"), search in description/name
                whereClause.OR = [
                    ...(whereClause.OR || []),
                    { description: { contains: type, mode: 'insensitive' } },
                    { name: { contains: type, mode: 'insensitive' } }
                ];
            }
        }

        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }

        // General Query Fallback
        if (!type && !location && query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ];

            // Try to match query against enum too
            const upperQuery = query.toUpperCase();
            if (['COMMERCIAL', 'WAREHOUSING', 'RESIDENTIAL'].includes(upperQuery)) {
                whereClause.OR.push({ type: upperQuery });
            }
        }

        try {
            const properties = await prisma.property.findMany({
                where: whereClause,
                take: 5,
                select: {
                    id: true,
                    name: true,
                    location: true,
                    type: true, // Correct field name
                    pricePerSqft: true, // Correct field
                    yield: true, // Correct field
                    irr: true,
                    minInvestment: true,
                    assetValue: true,
                    image: true
                }
            });

            if (properties.length === 0) {
                return "No properties found matching your criteria.";
            }

            return JSON.stringify(properties);
        } catch (error) {
            console.error("Error searching properties:", error);
            return "Error occurred while searching for properties.";
        }
    },
    {
        name: "search_properties",
        description: "Search for properties in the marketplace. Use this to find commercial, residential, or holiday homes.",
        schema: z.object({
            query: z.string().optional().describe("General search term provided by user"),
            type: z.string().optional().describe("Type of property e.g., 'Commercial', 'Residential', 'Holiday Home'"),
            location: z.string().optional().describe("Location or city name e.g., 'Mumbai', 'Bangalore'")
        }),
    }
);

// Market Agent Tool: Get Location Prices from propVista MongoDB
const getLocationPropertyPricesTool = tool(
    async ({ locationName }) => {
        const uri = "mongodb://192.168.1.198:27017";
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const database = client.db('propVista');
            const areasCollection = database.collection('areas');
            const districtsCollection = database.collection('districts');

            console.log(`Searching MongoDB propVista.areas for locationName: ${locationName}`);

            // Case-insensitive regex search in areas
            const area = await areasCollection.findOne({
                name: { $regex: new RegExp(locationName, 'i') }
            });

            if (area) {
                const stats = area.stats || {};
                return JSON.stringify({
                    level: "Area",
                    name: area.name,
                    districtName: area.district_name,
                    avgPricePerSqft: stats.avg_price_per_sqft || "N/A",
                    maxPricePerSqft: stats.max_price_per_sqft || "N/A",
                    minPricePerSqft: stats.min_price_per_sqft || "N/A",
                    totalTransactions: stats.total_transactions || 0
                });
            }

            console.log(`Not found in areas, searching propVista.districts for: ${locationName}`);

            // If not found in areas, search in districts
            const district = await districtsCollection.findOne({
                name: { $regex: new RegExp(locationName, 'i') }
            });

            if (district) {
                const stats = district.stats || {};
                return JSON.stringify({
                    level: "District",
                    name: district.name,
                    stateName: district.state_name || "N/A",
                    avgPricePerSqft: stats.avg_price_per_sqft || "N/A",
                    maxPricePerSqft: stats.max_price_per_sqft || "N/A",
                    minPricePerSqft: stats.min_price_per_sqft || "N/A",
                    totalTransactions: stats.total_transactions || 0
                });
            }

            return `No data found for the location: ${locationName} in either areas or districts.`;
        } catch (error: any) {
            console.error("Error querying MongoDB for location prices:", error);
            return `Error retrieving location prices: ${error.message}`;
        } finally {
            await client.close();
        }
    },
    {
        name: "get_location_property_prices",
        description: "Fetch average, maximum, and minimum price per square foot (sqft) stats for a specific location (checks area/locality first, then district) from the database.",
        schema: z.object({
            locationName: z.string().describe("Name of the area, locality, or district to query (e.g., 'Mugali', 'Kondhwa', 'Thane')")
        })
    }
);

// Portfolio Agent Tool: Get Portfolio Stats
const getPortfolioTool = tool(
    async ({ userId }) => {
        if (!userId) {
            return "User ID is missing. Cannot fetch portfolio.";
        }

        try {
            const stats = await authService.getDashboardStats(userId);
            const wallet = await authService.getWallet(userId);

            return JSON.stringify({
                totalInvestment: stats.totalInvestment,
                propertiesCount: stats.propertyCount,
                walletBalance: wallet.balance,
                currency: wallet.currency,
                assets: stats.assets.map((a: any) => ({
                    propertyId: a.id,
                    name: a.name,
                    sqftOwned: a.sqftOwned,
                    totalValue: a.totalValue
                })),
                recentTransactions: stats.transactions.slice(0, 3)
            });
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            return "Error fetching portfolio data.";
        }
    },
    {
        name: "get_portfolio_stats",
        description: "Get the current user's portfolio statistics, active holdings (including exact propertyIds), investments, and wallet details. Requires User ID.",
        schema: z.object({
            userId: z.string().describe("User ID to fetch portfolio for")
        })
    }
);

// Portfolio Agent Tool: Sell Property
const sellPropertyTool = tool(
    async ({ userId, propertyId, sqftAmount }) => {
        if (!userId || !propertyId || !sqftAmount) {
            return "Missing parameters. Required: userId, propertyId, sqftAmount.";
        }

        try {
            const result = await propertyService.sell(userId, propertyId, sqftAmount);
            return `Successfully sold ${sqftAmount} sqft. The user's wallet has been credited.`;
        } catch (error: any) {
            console.error("Error selling property:", error);
            return `Error selling property: ${error.message}`;
        }
    },
    {
        name: "sell_property",
        description: "Sell a specific amount of square feet of a property holding for the user. USE THIS when the user explicitly asks to sell a specific property.",
        schema: z.object({
            userId: z.string().describe("User ID of the investor"),
            propertyId: z.string().describe("The exact ID of the property to sell from get_portfolio_stats"),
            sqftAmount: z.number().describe("The amount in square feet to sell")
        })
    }
);

// --- AGENT PROMPTS ---

const MARKET_AGENT_SYSTEM_PROMPT = `You are a specialized Real Estate Market Scout for RealBlock.
Your role is to help users find high-yield tokenized real estate assets and provide market price insights.
You have access to a 'search_properties' tool for searching available tokenized properties on the platform.
You also have access to a 'get_location_property_prices' tool. USE IT when the user specifically asks about the average, max, or min price per sqft or property trends in a particular location/area/district (e.g. "What are the prices per sqft in Mugali?").

When answering about location prices, present the data clearly (average, minimum, maximum price per sqft).
When listing properties, use the following Markdown format for EACH property:
![Property Image](IMAGE_URL)
**[PROPERTY_NAME](/properties/PROPERTY_ID)**
- 📍 **Location:** LOCATION
- 💰 **Yield:** YIELD | **IRR:** IRR
- 🏷️ **Price/Sqft:** PRICE
- 💵 **Min Investment:** MIN_INVESTMENT

---

Always ensure the property name is a clickable link to /properties/{id} and the image is displayed.
If the user asks about anything unrelated to real estate or properties, politely refuse.
User Query comes from the Supervisor.`;

const PORTFOLIO_AGENT_SYSTEM_PROMPT = `You are a dedicated Portfolio Manager for RealBlock.
Your role is to assist users with their investment queries.
You have access to 'get_portfolio_stats' and 'sell_property'.
When asked about performance, balance, or checking holdings, use 'get_portfolio_stats'.
When asked to sell holdings or a property, first use 'get_portfolio_stats' to get the user's active holdings and exact propertyIds, then use 'sell_property' to execute the sale.
Interpret the data for the user in a professional, encouraging tone.
If the user asks about anything unrelated to their portfolio or investments, politely refuse.`;

const ADVISOR_AGENT_SYSTEM_PROMPT = `You are a Wealth Advisor for RealBlock.
Your role is to explain financial concepts related to Real Estate Tokenization (e.g., Yield, IRR, Tokenization, Blockchain security).
You DO NOT have access to live database tools, but you have deep knowledge of finance.
Explain concepts clearly and concisely.
If asked about specific property data, refer them to the Market Scout.
If asked about personal portfolio data, refer them to the Portfolio Manager.`;

const SUPERVISOR_SYSTEM_PROMPT = `You are the Supervisor of a RealBlock support team.
You have 3 specialized agents:
1. "MarketScout": For searching properties, buying real estate, finding assets.
2. "PortfolioManager": For checking personal investments, dividends, balance, profit/loss.
3. "WealthAdvisor": For educational questions about finance terms (Yield, IRR), risks, or general advice.

Your job is to route the user's request to the MOST appropriate agent.
Return the name of the agent to call: "MarketScout", "PortfolioManager", "WealthAdvisor".
If the query is a simple greeting like "Hi", "Hello", or "Hey", route it to "WealthAdvisor".
If the query is completely unrelated to real estate, finance, or the app (e.g. "Write a poem", "What is the capital of France"), reply with "Personal" and I will handle it by refusing.
`;

// --- LANGGRAPH SETUP ---

// Define State
const AgentState = {
    channels: {
        messages: {
            reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
            default: () => [] as BaseMessage[],
        },
        next: {
            reducer: (x: (string | null), y: (string | null)) => y ?? x,
            default: () => null as string | null,
        },
        userId: {
            reducer: (x: string | null, y: string | null) => y ?? x,
            default: () => null as string | null,
        }
    }
};

// Initialize LLM
const llm = new ChatOpenAI({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY
});

// Create Supervisor Node
const supervisorNode = async (state: any) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    const routerParams = z.object({
        next: z.enum(["MarketScout", "PortfolioManager", "WealthAdvisor", "Personal"])
    });

    const supervisorChain = llm.withStructuredOutput(routerParams);

    const response = await supervisorChain.invoke([
        new SystemMessage(SUPERVISOR_SYSTEM_PROMPT),
        lastMessage
    ]);

    return { next: response.next };
};

// Create Market Scout Node
const marketScoutNode = async (state: any) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    const marketLlm = llm.bindTools([searchPropertiesTool, getLocationPropertyPricesTool]);
    const response = await marketLlm.invoke([
        new SystemMessage(MARKET_AGENT_SYSTEM_PROMPT),
        lastMessage
    ]);

    if (response.tool_calls && response.tool_calls.length > 0) {
        const toolMessages = [];
        for (const toolCall of response.tool_calls) {
            let toolResult;
            if (toolCall.name === 'search_properties') {
                toolResult = await searchPropertiesTool.invoke(toolCall.args as any);
            } else if (toolCall.name === 'get_location_property_prices') {
                toolResult = await getLocationPropertyPricesTool.invoke(toolCall.args as any);
            }

            // Correctly format the tool output as a ToolMessage
            toolMessages.push(new ToolMessage({
                tool_call_id: toolCall.id!,
                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
                name: toolCall.name
            }));
        }

        const finalResponse = await llm.invoke([
            new SystemMessage(MARKET_AGENT_SYSTEM_PROMPT),
            lastMessage,
            response, // AIMessage with tool_calls
            ...toolMessages // ToolMessages responding
        ]);

        return {
            messages: [finalResponse],
            next: END
        };
    }

    return { messages: [response], next: END };
};

// Create Portfolio Manager Node
const portfolioManagerNode = async (state: any) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
    const userId = state.userId || "UNKNOWN_USER";

    const portfolioLlm = llm.bindTools([getPortfolioTool, sellPropertyTool]);
    const response = await portfolioLlm.invoke([
        new SystemMessage(PORTFOLIO_AGENT_SYSTEM_PROMPT + `\n\nCurrent User ID provided by system: ${userId}`),
        lastMessage
    ]);

    if (response.tool_calls && response.tool_calls.length > 0) {
        const toolMessages = [];
        for (const toolCall of response.tool_calls) {
            // Ensure userId is passed if the LLM missed it (though prompt should ensure it)
            if (!toolCall.args.userId) {
                toolCall.args.userId = userId;
            }

            let toolResult;
            if (toolCall.name === 'get_portfolio_stats') {
                toolResult = await getPortfolioTool.invoke(toolCall.args as any);
            } else if (toolCall.name === 'sell_property') {
                toolResult = await sellPropertyTool.invoke(toolCall.args as any);
            }

            toolMessages.push(new ToolMessage({
                tool_call_id: toolCall.id!,
                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
                name: toolCall.name
            }));
        }

        const finalResponse = await llm.invoke([
            new SystemMessage(PORTFOLIO_AGENT_SYSTEM_PROMPT),
            lastMessage,
            response,
            ...toolMessages
        ]);
        return { messages: [finalResponse], next: END };
    }

    return { messages: [response], next: END };
};

// Create Wealth Advisor Node
const wealthAdvisorNode = async (state: any) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    const response = await llm.invoke([
        new SystemMessage(ADVISOR_AGENT_SYSTEM_PROMPT),
        lastMessage
    ]);

    return { messages: [response], next: END };
};

// Create Personal/Refusal Node
const personalRefusalNode = async (state: any) => {
    return {
        messages: [new SystemMessage("I can only assist with Real Estate, Portfolio Logic, or Financial Advice related to RealBlock. Please ask me something about the platform!")],
        next: END
    };
};

// Construct Graph
const workflow = new StateGraph(AgentState as any)
    .addNode("Supervisor", supervisorNode)
    .addNode("MarketScout", marketScoutNode)
    .addNode("PortfolioManager", portfolioManagerNode)
    .addNode("WealthAdvisor", wealthAdvisorNode)
    .addNode("Personal", personalRefusalNode)
    .addEdge(START, "Supervisor")
    .addConditionalEdges("Supervisor", (state: any) => state.next);

const app = workflow.compile();


// --- API ROUTE ---

aiRouter.post('/chat', async (req: any, res: any) => {
    try {
        const { message, previousMessages, userId } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            console.error("OpenAI API Key provided: ", !!process.env.OPENAI_API_KEY);
            res.status(500).json({ error: "OpenAI API Key not configured" });
            return;
        }

        const input = {
            messages: [new HumanMessage(message)],
            userId: userId || "TEST_ID" // Fallback if not provided
        };

        const config = { recursionLimit: 10 };

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await app.stream(input, config);

        let finalResponse = "";

        for await (const event of stream) {
            const eventKeys = Object.keys(event);
            for (const key of eventKeys) {
                if (key === 'MarketScout' || key === 'PortfolioManager' || key === 'WealthAdvisor' || key === 'Personal') {
                    const messages = event[key]?.messages;
                    if (messages && messages.length > 0) {
                        const lastMsg = messages[messages.length - 1];
                        if (lastMsg && lastMsg.content) {
                            const msgContent = typeof lastMsg.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg.content);
                            finalResponse = msgContent;

                            // Send the full node response as a chunk
                            res.write(`data: ${JSON.stringify({ response: msgContent })}\n\n`);
                        }
                    }
                }
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error: any) {
        console.error("AI Agent Error Stack:", error);

        // If headers weren't sent yet, we can send JSON error
        if (!res.headersSent) {
            let errorMessage = "Failed to process AI request";
            if (error?.response?.data?.error?.message) {
                errorMessage = `AI Provider Error: ${error.response.data.error.message}`;
            } else if (error?.message) {
                errorMessage = `Error: ${error.message}`;
            }
            res.status(500).json({ error: errorMessage });
        } else {
            // If streaming started, we might need to send an error event (simplified here)
            res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
            res.end();
        }
    }
});

export default aiRouter;
