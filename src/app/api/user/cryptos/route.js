import connectToDatabase from "@/lib/db/connectDB";
import Crypto from "@/server/models/crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const cryptos = await Crypto.find({});

    // Assuming cryptos[0] is a Mongoose document
    const firstCrypto = cryptos[0]?.toObject();

    return NextResponse.json(firstCrypto);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      {
        status: 500,
      }
    );
  }
}

// import connectToDatabase from "@/lib/db/connectDB";
// import Crypto from "@/server/models/crypto";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectToDatabase();
//     const cryptos = await Crypto.find({});

//     return NextResponse.json(cryptos[0]);
//   } catch (error) {
//     // // console.log({ error: error.message });
//     return NextResponse.json(
//       { error: error.message },
//       {
//         status: 500,
//       }
//     );
//   }
// }
