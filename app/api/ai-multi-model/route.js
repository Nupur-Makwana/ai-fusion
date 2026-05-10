import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { model, msg, parentModel } = body;

    console.log("Payload being sent to Kravix:", { message: msg, aiModel: model });

    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg,
        aiModel: model,
        outputType: "text"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.KRAVIXSTUDIO_API_KEY}`
        }
      }
    );

    return NextResponse.json({
      ...response.data,
      model: parentModel
    });

  } catch (error) {
    // This logs the error to your VS Code terminal
    console.error("DETAILED ERROR:", error.response?.data || error.message);

    // This sends the error details back to Postman
    return NextResponse.json({ 
      status: "error",
      message: error.message,
      apiResponse: error.response?.data // This tells you what Kravix said was wrong
    }, { status: 500 });
  }
}