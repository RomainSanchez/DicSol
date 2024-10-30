"use client";

import Image from "next/image";
import { init } from "@jup-ag/terminal";
import "@jup-ag/terminal/css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    init({
      displayMode: "integrated",
      integratedTargetId: "integrated-terminal",
      endpoint: process.env.NEXT_PUBLIC_RPC_URL,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          <ul className="flex flex-wrap space-x-4">
            <li>
              <a href="#hero" className="text-white hover:text-gray-400">
                Home
              </a>
            </li>
            <li>
              <a href="#token-swap" className="text-white hover:text-gray-400">
                Token Swap
              </a>
            </li>
            <li>
              <a
                href="#last-raffles"
                className="text-white hover:text-gray-400"
              >
                Last 10 Raffles
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <section className="hero-token-swap bg-gray-700 p-8 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="hero">
            <h2 className="text-3xl font-bold mb-4">Welcome to My App</h2>
            <p className="mb-4">
              This is a single page dark theme app with a nav bar, a footer, and
              several sections.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Call to Action
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <div id="integrated-terminal" className="token-swap">
              <h2 className="text-3xl font-bold mb-4">Token Swap</h2>
              <p className="mb-4">Placeholder for a token swap component.</p>
            </div>
          </div>
        </section>

        <section className="last-raffles bg-gray-700 p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">Last 10 Raffles</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600">Epoch</th>
                  <th className="py-2 px-4 border-b border-gray-600">Ended</th>
                  <th className="py-2 px-4 border-b border-gray-600">Winner</th>
                  <th className="py-2 px-4 border-b border-gray-600">Amount</th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder for last 10 raffles */}
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 1
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 1
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 1
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 1
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 1
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 2
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 2
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 2
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 2
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 2
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 3
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 3
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 3
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 3
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 3
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 4
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 4
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 4
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 4
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 4
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 5
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 5
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 5
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 5
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 5
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 6
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 6
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 6
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 6
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 6
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 7
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 7
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 7
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 7
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 7
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 8
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 8
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 8
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 8
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 8
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 9
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 9
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 9
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 9
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 9
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Epoch 10
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Ended 10
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Winner 10
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Amount 10
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    Transaction ID 10
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="faq bg-gray-700 p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-bold mb-4">FAQ</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">What is this app?</h3>
            <p>
              This app is a single page dark theme application with various
              sections.
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">
              How do I use the token swap?
            </h3>
            <p>
              The token swap component is a placeholder for now. More details
              will be added later.
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">
              How can I see the last 10 raffles?
            </h3>
            <p>The last 10 raffles section displays the most recent raffles.</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
