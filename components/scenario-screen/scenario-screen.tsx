"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ScenarioStep } from "./scenario-step";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useScenarios } from "@/hooks/use-scenarios";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";

export const ScenarioScreen = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const {
    scenarios,
    setScenarios,
    editScenario,
    removeScenario,
    setStepState,
    stepState,
  } = useScenarios();

  const Data = [
    {
        "id": "789e4567-e89b-12d3-a456-434314174123",
        "name": "Credential Issuance",
        "description": "This workflow issues credentials to users",
        "type": "ISSUANCE",
        "steps": [
            {
                "id": "123e4567-e89b-12d3-a456-434314174000",
                "title": "Verify Identity",
                "description": "Verify the user's identity",
                "order": 1,
                "type": "HUMAN_TASK",
                "subFlow": "123e4567-e89b-12d3-a456-434314174000",
                "actions": [
                    {
                      "id": "123e4567-ef2d-12d3-abcd-426614174456",
                      "title": "Download Wallet",
                      "text": "Download your wallet to continue"
                  },
                    {
                        "id": "123e4567-ef2d-12d3-abcd-426614174451",
                        "title": "Connect Wallet",
                        "text": "Connect your wallet to continue"
                    }
                ],
                "asset": {
                    "id": "123e4567-e89b-12d3-a456-426614174469",
                    "mediaType": "image/jpeg",
                    "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                    "fileName": "asset.jpg",
                    "description": "A beautiful image of a cat"
                }
            }
        ],
        "personas": [
            {
                "id": "123e4567-e89b-12d3-a456-426614174456",
                "name": "John Doe",
                "role": "Verifier",
                "description": "John Doe is a verifier for the system",
                "headshotImage": {
                    "id": "123e4567-e89b-12d3-a456-426614174469",
                    "mediaType": "image/jpeg",
                    "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                    "fileName": "asset.jpg",
                    "description": "A beautiful image of a cat"
                },
                "bodyImage": {
                    "id": "123e4567-e89b-12d3-a456-426614174469",
                    "mediaType": "image/jpeg",
                    "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                    "fileName": "asset.jpg",
                    "description": "A beautiful image of a cat"
                }
            }
        ],
        "relyingParty": {
            "id": "76543210-e89b-12d3-a456-426614174469",
            "name": "Relying Party Name",
            "description": "This relying party verifies credentials from issuers",
            "type": "ARIES",
            "organization": "Acme Corporation",
            "logo": {
                "id": "123e4567-e89b-12d3-a456-426614174469",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
            },
            "credentialDefinitions": [
                {
                    "id": "123e4567-e89b-12d3-a456-426614174123",
                    "name": "Credential Definition Name",
                    "version": "1.0",
                    "type": "ANONCRED",
                    "attributes": [
                        {
                            "id": "890e4567-e89b-12d3-a456-426614174123",
                            "name": "name",
                            "value": "John Doe",
                            "type": "STRING"
                        }
                    ],
                    "representations": [
                        {
                            "id": "123e4567-e89b-12d3-abcd-426614174456"
                        },
                        {
                            "id": "123e4567-e89b-12d3-abcd-426614174456",
                            "credDefId": "123e4567-e89b-12d3-a456-426614174123",
                            "schemaId": "123e4567-e89b-12d3-a456-426614174123",
                            "ocaBundleUrl": "https://example.com/ocaBundle.json"
                        }
                    ],
                    "revocation": {
                        "id": "abcd4567-e89b-12d3-a456-426614174123",
                        "title": "Revocation Information",
                        "description": "This credential is revocable"
                    },
                    "icon": {
                        "id": "123e4567-e89b-12d3-a456-426614174469",
                        "mediaType": "image/jpeg",
                        "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                        "fileName": "asset.jpg",
                        "description": "A beautiful image of a cat"
                    }
                }
            ]
        }
    }
]

const Showcases = {
  "showcase": {
    "id": "123e4567-e89b-12d3-a456-426614174456",
    "name": "Credential Showcase BCGov",
    "description": "Collection of credential usage scenarios",
    "status": "PENDING",
    "hidden": false,
    "scenarios": [
      {
        "id": "789e4567-e89b-12d3-a456-434314174123",
        "name": "Parking Permit",
        "description": "This scenario Presentation credentials to users",
        "type": "PRESENTATION",
        "steps": [
          {
            "id": "123e4567-e89b-12d3-a456-434314174000",
            "title": "Presentation Identity",
            "description": "Presentation the user's identity",
            "order": 1,
            "type": "HUMAN_TASK",
            "subScenario": "123e4567-e89b-12d3-a456-434314174000",
            "actions": [
              {
                "id": "123e4567-ef2d-12d3-abcd-426614174451",
                "title": "Connect Wallet",
                "text": "Connect your wallet to continue"
              }
            ],
            "asset": {
              "id": "123e4567-e89b-12d3-a456-426614174469",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          }
        ],
        "personas": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174456",
            "name": "John",
            "role": "professor",
            "description": "John is a professor in the college",
            "headshotImage": {
              "id": "123e4567-e89b-12d3-a456-426614174469",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            },
            "bodyImage": {
              "id": "123e4567-e89b-12d3-a456-426614174469",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          }
        ]
      },
      {
        "id": "789e4567-e89b-12d3-a456-434314174126",
        "name": "Credential Issuance",
        "description": "This scenario issues credentials to users",
        "type": "PRESENTATION",
        "steps": [
          {
            "id": "123e4567-e89b-12d3-a456-434314174001",
            "title": "Verify Identity",
            "description": "Verify the user's identity",
            "order": 1,
            "type": "HUMAN_TASK",
            "subScenario": "123e4567-e89b-12d3-a456-434314174003",
            "actions": [
              {
                "id": "123e4567-ef2d-12d3-abcd-426614174454",
                "title": "Connect Wallet1",
                "text": "Connect your wallet to continue"
              },
              {
                "id": "123e4567-ef2d-12d3-abcd-426614174455",
                "title": "Download Wallet1",
                "text": "Download your wallet to continue"
              }
            ],
            "asset": {
              "id": "123e4567-e89b-12d3-a456-426614174461",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          },
          {
            "id": "123e4567-e89b-12d3-a456-434314174002",
            "title": "Download Wallet",
            "description": "Download Wallet to continue",
            "order": 1,
            "type": "HUMAN_TASK",
            "subScenario": "123e4567-e89b-12d3-a456-434314174004",
            "actions": [
              {
                "id": "123e4567-ef2d-12d3-abcd-426614174456",
                "title": "Connect Wallet",
                "text": "Connect your wallet to continue"
              },
              {
                "id": "123e4567-ef2d-12d3-abcd-426614174452",
                "title": "Download Wallet",
                "text": "Download your wallet to continue"
              }
            ],
            "asset": {
              "id": "123e4567-e89b-12d3-a456-426614174466",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          }
        ],
        "personas": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174452",
            "name": "Ana",
            "role": "Student",
            "description": "Ana is a verifier for the system",
            "headshotImage": {
              "id": "123e4567-e89b-12d3-a456-426614174461",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            },
            "bodyImage": {
              "id": "123e4567-e89b-12d3-a456-426614174462",
              "mediaType": "image/jpeg",
              "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          }
        ]
      }
    ],
    "credentialDefinitions": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174127",
        "name": "Credential Definition Name",
        "issuerId": "123e4567-e89b-12d3-a456-426614174122",
        "schemaId": "123e4567-e89b-12d3-a456-426614174121",
        "identifierType": "DID",
        "identifier": "did:sov:XUeUZauFLeBNofY3NhaZCB",
        "version": "1.0",
        "type": "ANONCRED",
        "representations": [
          {
            "id": "123e4567-e89b-12d3-abcd-426614174452"
          },
          {
            "id": "123e4567-e89b-12d3-abcd-426614174453",
            "credDefId": "123e4567-e89b-12d3-a456-426614174123",
            "schemaId": "123e4567-e89b-12d3-a456-426614174123",
            "ocaBundleUrl": "https://example.com/ocaBundle.json"
          }
        ],
        "revocation": {
          "id": "abcd4567-e89b-12d3-a456-426614174123",
          "title": "Revocation Information",
          "description": "This credential is revocable"
        },
        "icon": {
          "id": "123e4567-e89b-12d3-a456-426614174469",
          "mediaType": "image/jpeg",
          "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
          "fileName": "asset.jpg",
          "description": "A beautiful image of a cat"
        }
      }
    ],
    "personas": {}
  }
}

  const Maindata = Showcases.showcase;
  const Scenarios = Maindata.scenarios;

  const scenarioData = Scenarios.map((item) => item);
  console.log("Scenario Data:", scenarioData);

  // Extract personas
  const personas = scenarioData.flatMap((scenario) => scenario.personas);
  console.log("Personas:", personas);

  let intialId = personas[0]?.id || ""
  const [selectedPersonaId, setSelectedPersonaId] = useState(intialId);

  // Find the selected persona
  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  console.log('selectedPersona',selectedPersona);

  // Find the scenario that includes this persona
  const selectedScenario = scenarioData.find((scenario) =>
    scenario.personas.some((persona) => persona.id === selectedPersonaId)
  );

  console.log('selectedScenario ',selectedScenario);

  const Steps = selectedScenario ? selectedScenario.steps : []
  console.log('Stepss',Steps);

  // Extract actions from steps in the selected scenario
  const actions = selectedScenario ? selectedScenario.steps.flatMap((step) => step.actions) : [];

  console.log('Actions',actions)

  let STeps = Data;
  let Personas = personas
  let Issuer = Data[0].relyingParty;

  // console.log('Showcase JSON', showcaseJSON.personas[selectedCharacter].scenarios);

  // const initialScenarios = JSON.parse(
  //   JSON.stringify(STeps)
  // );

  const initialScenarios = useMemo(() => {
    return JSON.parse(
      JSON.stringify(scenarioData)
    );
    // return JSON.parse(
    //   JSON.stringify(STeps)
    // );
  },[selectedCharacter,selectedPersonaId])
  // const initialScenarios = useMemo(() => {
  //   return JSON.parse(
  //     JSON.stringify(showcaseJSON.personas[selectedCharacter].scenarios)
  //   );
  //   // return JSON.parse(
  //   //   JSON.stringify(STeps)
  //   // );
  // },[selectedCharacter])
 

  useEffect(() => {
    setScenarios(initialScenarios);
    console.log('initialScenarios', initialScenarios);
  }, [initialScenarios, setScenarios]);

  const handleAddScenario = () => {
    const newScenario = {
      id: Date.now().toString(),
      name: "",
      status: "draft" as const,
      overview: {
        title: "",
        text: "",
        image: "",
      },
      summary: {
        title: "",
        text: "",
        image: "",
      },
      steps: [],
    };
    editScenario(scenarios.length);
    setScenarios([...scenarios, newScenario]);
  };

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
    }
  ];

  // console.log('scenarios:', scenarios);
  return (
    <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
      <div className="flex bg-gray-100 rounded-md border-b">
        {Personas && Personas.map((char: any, index: number) => (
          <div
            key={char.id}
            onClick={() => setSelectedPersonaId(char.id)}
            className={`w-1/2 p-4 text-center border ${
              index === 0 ? "bg-white dark:bg-dark-bg shadow-md" : "bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Character Avatar Placeholder */}
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-2">
                <Image
                  // src={char.headshotImage.content}
                  src={
                    char.headshotImage?.content ||
                    "/assets/NavBar/Joyce.png"
                  }
                  alt={char.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>

              <div className="text-lg font-semibold">{char.name}</div>
              <div className="text-sm text-gray-500">{char.role}</div>

              {/* Status Badge */}
              {stepState == "none-selected" && (
                <div className="w-full mt-2 px-3 py-1 bg-yellow-400 text-xs font-semibold rounded">
                  Incomplete
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-cols">
        <div className="border-b w-full light-border dark:dark-border">
          <div className="p-4">
            <h2 className="text-base font-bold">
              {t("onboarding.editing_steps_label", { name:selectedPersona?.name })}
            </h2>
            <p className="text-xs">{t("onboarding.editing_steps_message")}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          {scenarios.map((scenario, index) => (
            console.log('loop scenario',scenario),
            <div
              key={scenario.id}
              className="pb-2 border rounded-lg dark:border-dark-border overflow-hidden flex"
            >
              <div className="w-12 bg-[#3A3B3B] flex justify-center items-center">
                <Copy className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="p-3 bg-light-bg dark:bg-dark-bg">
                  <h3 className="text-xl font-bold">{selectedScenario?.name}</h3>
                </div>

                {/* Steps Section */}
                <div className="p-2">
                  <DndContext key={index} collisionDetection={closestCenter}>
                    <SortableContext
                      items={scenario.steps.map((step) => step.id)}
                      strategy={verticalListSortingStrategy}
                      key={scenario.id}
                    >
                  {scenario.steps.map((step, stepIndex) => (
                      <div key={step.id}>
                        {/* {step.actions.map((action, actionIndex) => ( */}
                          <ScenarioStep
                            key={step.id} // Ensure each action has a unique key
                            step={step} // Pass action directly
                            stepIndex={stepIndex}
                            actionIndex={stepIndex} // Optional if needed
                            scenarioIndex={index}
                            totalSteps={scenario.steps.length}
                          />
                        {/* ))} */}
                      </div>
                    ))}

                    </SortableContext>
                  </DndContext>

                  <div className="mt-4 flex justify-end">
                    <ButtonOutline
                      onClick={() => {
                        setStepState("adding-step");
                      }}
                    >
                      {t("scenario.add_step_label")}
                    </ButtonOutline>
                  </div>
                </div>
                <div className="p-5 bg-light-bg dark:bg-dark-bg">
                  <Button
                    variant="destructive"
                    onClick={() => removeScenario(index)}
                  >
                    {t("scenario.delete_scenario_label")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 mt-auto">
        <ButtonOutline
          className="w-full"
          onClick={() => {
            handleAddScenario()
            // setStepState("editing-scenario");
            // window.scrollTo({ top: 200, behavior: "smooth" });
          }}
        >
          {t("scenario.add_scenario_label").toUpperCase()}
        </ButtonOutline>
      </div>
    </div>
  );
};
