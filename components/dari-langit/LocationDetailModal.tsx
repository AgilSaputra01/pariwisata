"use client";

import React from "react";
import { LocationMarkerData } from "@/lib/data/lombok-3d-data";
import { DestinationDetailPopup } from "./DestinationDetailPopup";

interface LocationDetailModalProps {
  marker: LocationMarkerData | null;
  onClose: () => void;
  onBookFastboat?: (slug: string) => void;
  onBookCar?: (category: string) => void;
}

export function LocationDetailModal(props: LocationDetailModalProps) {
  return <DestinationDetailPopup {...props} />;
}

