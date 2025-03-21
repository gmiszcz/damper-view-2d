import React, { createContext, useReducer, useContext } from "react";
import { partsReducer } from "../../reducers/partsReducer";
import { createAnnotation, getInitialState } from "../../utils/helpers";
import { PARTS_COLORS } from "../../utils/constants";

// Initial state for CVSAe
let geometryCVSAe = {
  CVSAe_ValvePosition: 0,
  CVSAe_ValveOrient: "",
  CVSAe_WeldSize: 0,
  CVSAe_HousingTH: 0,
  CVSAe_HousingDiam: 0,
  CVSAe_HousingHeight: 0,
  CVSAe_HoleMajorDiam: 0,
  CVSAe_HoleMinorDiam: 0,
  CVSAe_HoleCutDist: 0,
  CVSAe_StepTH: 0,
  CVSAe_StepHeight: 0,
};

// Initial state with annotations
let initialState = getInitialState(geometryCVSAe)

// Create Context
const ContextCVSAe = createContext();

// Provider
export const ProviderCVSAe = ({ children }) => {
  const [state, dispatch] = useReducer(partsReducer, initialState);

  return <ContextCVSAe.Provider value={{ state, dispatch }}>{children}</ContextCVSAe.Provider>;
};

// Custom hook to use context
export const useCVSAe = () => {
  const context = useContext(ContextCVSAe);
  if (!context) {
    throw new Error("useCVSAe must be used within a ProviderCVSAe");
  }
  return context;
};
