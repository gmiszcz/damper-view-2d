import React, { useEffect } from "react";
import { Line, Group, Rect } from "react-konva";
import { usePartsContext } from "../../context/PartsContext";
import { useSize } from "../../context/SizeContext";
import { GLOBAL_OFFSET } from "../../utils/constants";
import { changeBrightness } from "../../utils/utils";
import { handleToggleAnnotations } from "../../utils/helpers";

const CES = ({}) => {
  const { CVSAe, RT, Positions } = usePartsContext();
  const { state: size } = useSize();

  const { CVSAe_HousingDiam, CVSAe_HousingTH, CVSAe_HousingHeight } = CVSAe.state.geometry;
  const { CVSAe_ValvePosition } = Positions.state.geometry;

  const {RT_OD1, RT_TH} = RT.state.geometry;

  const { color, opacity, display, annotationsVisible } = CVSAe.state.properties;


  // Calculate CES additional parameters
  // Weld size is 1.1 times the thickness of the RT, where 1.1 is a Tomek's factor
  const weldSize = 1.1 * RT_TH; 

  const positionXOffset = size.width - GLOBAL_OFFSET.x;
  const positionYOffset = size.height - GLOBAL_OFFSET.y;

  //**********  DIMENSION LINES *********/
    
    // Update or create annotation for CES
      useEffect(() => {
        const isVisible = CVSAe.state.properties.annotationsVisible;
        // Pressure tube LENGTH annotation
        CVSAe.dispatch({
          type: "UPDATE_OR_CREATE_ANNOTATION",
          payload: {
            id: "CES_Position_Annotation",
            startX: 0,
            startY: RT_OD1 - 30,
            direction: "horizontal",
            value: CVSAe_ValvePosition,
            label: "CES Position",
            display: isVisible,
            important: true,
          },
        });
      }, [CVSAe_ValvePosition, annotationsVisible])

  //**********  GEOMETRY *********/

  const check_RT_OD_in_specified_position = (position) => {

  }

  const generate_CES_weld_points = (leftOrRightWeld) => { 
    // This function will generate the points for the welds on the CES
    const a = (2.0 * weldSize) / Math.sqrt(2.0);


    let cesWeldPoints =[]
    if (leftOrRightWeld === "right") {
      cesWeldPoints = [
        [0.0, 0.0], //0
        [a, 0.0], //1
        [0.0, -a], //2
      ];
    }
    else {
      cesWeldPoints = [
        [0.0, 0.0], //0
        [0.0, -a], //1
        [-a, 0.0], //2
      ];
    }
      

    return cesWeldPoints.flat();
  }


  return (
    <Group x={positionXOffset} y={positionYOffset} onClick={() => handleToggleAnnotations(CVSAe)} >
      {/* CES Outer shape */}
      <Rect x = {-CVSAe_ValvePosition - CVSAe_HousingDiam/2.0} y = {-RT_OD1/2.0-CVSAe_HousingHeight} width={CVSAe_HousingDiam} height={CVSAe_HousingHeight} fill={color} opacity={display ? opacity : 0.1} shadowBlur={1}/>
      
      {/* Inner shape (cross-section) */}
      <Rect x = {-CVSAe_ValvePosition - CVSAe_HousingDiam/2.0 + CVSAe_HousingTH} y = {-RT_OD1/2.0-CVSAe_HousingHeight} width = {CVSAe_HousingDiam - 2*CVSAe_HousingTH} height={CVSAe_HousingHeight} fill={changeBrightness(color, 0.5)} opacity={display ? opacity : 0.1}/>
      
      {/* Right weld */}
      <Line x={-CVSAe_ValvePosition + CVSAe_HousingDiam - CVSAe_HousingDiam/2.0} y={-RT_OD1 / 2.0} points={generate_CES_weld_points("right")} closed fill="#ffc50e" opacity={display ? opacity : 0.1} shadowBlur={1} />
      {/* Left weld */}
      <Line x = {-CVSAe_ValvePosition - CVSAe_HousingDiam/2.0} y = {-RT_OD1/2.0} points={generate_CES_weld_points("left")} closed fill="#ffc50e" opacity={display ? opacity : 0.1} shadowBlur={1} />
      
    </Group>
  );
};

export default CES;
