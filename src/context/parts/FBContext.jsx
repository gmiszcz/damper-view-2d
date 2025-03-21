import React, { createContext, useReducer, useContext } from "react";
import { partsReducer } from "../../reducers/partsReducer";
import { createAnnotation, getInitialState } from "../../utils/helpers";
import { PARTS_COLORS } from "../../utils/constants";

// Initial state for Foot Bracket
let geometryFB = {
  FB_Customized: false,
  FB_PartNo: "",
  FB_ShowInReport: true,
  FB_Length: 0,
  FB_FrontHolePosition: 0,
  FB_FrontHoleAxisOffset: 0,
  FB_HoleSpan: 0,
  FB_RearHoleOffset: 0,
  FB_InnerWidth: 0,
  FB_OB_TH: 0,
  FB_IB_TH: 0,
  FB_ThreadDiam: 0,
  FB_ThreadPitch: 0,
  FB_BoltsHeadDiam: 0,
  FB_KnuckleTH_Gap: 0,
};

// Initial state with annotations
let initialState = getInitialState(geometryFB)

// Create Context
const ContextFB = createContext();

// Provider
export const ProviderFB = ({ children }) => {
  const [state, dispatch] = useReducer(partsReducer, initialState);

  return <ContextFB.Provider value={{ state, dispatch }}>{children}</ContextFB.Provider>;
};

// Custom hook to use context
export const useFB = () => {
  const context = useContext(ContextFB);
  if (!context) {
    throw new Error("useFB must be used within a ProviderFB");
  }
  return context;
};
