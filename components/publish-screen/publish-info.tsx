"use client";

import Image from "next/image";
import { useState } from "react";

export const PublishInfo = () => {

  const characters = [
    {
      id: 1,
      name: "Ana",
      type: "Student",
      description:
        "Meet Ana Ana is a student at BestBC College. To help make student life easier, BestBC College is going to offer Ana a digital Student Card to put in her BC Wallet.",
      headshot: "../../public/assets/NavBar/Joyce.png",
      bodyImage: "../../public/assets/NavBar/Joyce.png",
      selected: false,
      isHidden: false,
      credentials: [
        {
          id: 1,
          issuername: "Test college",
          name: "Student Card",
          logo: "../../public/assets/NavBar/Ana.png",
        },
        {
          id: 2,
          issuername: "Test college",
          name: "Permit Card",
          logo: "../../public/assets/NavBar/Ana.png",
        },
      ],
    },
    {
      id: 2,
      name: "Joyce",
      type: "Teacher",
      description:
        "Meet Joyce. Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
      headshot: "../../public/assets/NavBar/Joyce.png",
      bodyImage: "../../public/assets/NavBar/Joyce.png",
      selected: false,
      isHidden: false,
      credentials: [
        {
          id: 1,
          issuername: "Test college",
          name: "Student Card",
          logo: "../../public/assets/NavBar/Ana.png",
        },
        {
          id: 2,
          issuername: "Test college",
          name: "Permit Card",
          logo: "../../public/assets/NavBar/Ana.png",
        },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
      <div className="flex flex-col gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 flex flex-col"
          >
            {/* Character Header */}
            <div className="flex items-center gap-4">
              <Image
                src={require('../../public/assets/NavBar/Ana.png')}
                alt={char.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {char.name}
                </h3>
                <p className="text-gray-500 text-sm">{char.type}</p>
              </div>
            </div>

            {/* Credential Section */}
            <div className="mt-4 border-l-[16px] border-light-yellow bg-gray-50 dark:bg-gray-700 p-4">
              <p className="font-semibold text-gray-900 dark:text-white">
                Will receive the following credential(s):
              </p>

              <div className="mt-3 space-y-3">
                {char.credentials.map((cred) => (
                  <div key={cred.id} className="flex items-center gap-3">
                    <Image
                      src={require('../../public/assets/NavBar/Ana.png')}
                      alt={cred.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {cred.name}
                      </p>
                      <p className="text-gray-500 text-sm">{cred.issuername}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
