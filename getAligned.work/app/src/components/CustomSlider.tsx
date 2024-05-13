import { Box, Slider, Tooltip } from "@mui/material";

export function CustomSlider({ value, onChange }: any) {
  const marks = [
    { value: 0 },
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 },
    { value: 60 },
    { value: 70 },
    { value: 80 },
    { value: 90 },
    { value: 100 },
 ];

    // Custom ValueLabel component
    const CustomValueLabel = ({ children, open, value }: any) => (
        <Tooltip open={open} enterTouchDelay={0} placement="top"  title={`${value}%`} componentsProps={{
          // tooltip: {
          //     sx: {
          //         backgroundColor: 'white',
          //         color: '#00000099',
          //         '& .MuiTooltip-arrow': {
          //             color: 'white',
          //         },
          //     },
          // },
      }}
      >
            {children}
        </Tooltip>
    );
   
    return (
        <Box> 
            <Slider
              
                value={value}
                onChange={onChange}
                marks={marks}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
                min={0}
                max={100}
                step={10}
                components={{
                    ValueLabel: CustomValueLabel,
                }}
                sx={{
                    '& .MuiSlider-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#fff',
                        border: "3px solid #2196F3",
                        boxShadow:"0px 3px 1px -2px #00000033 0px 2px 2px 0px #00000024 0px 1px 5px 0px #0000001F",
                        
                        '&:hover': {
                            boxShadow: '0 0 8px rgba(0,0,0,0.16)',
                        },
                        '& .MuiSlider-active': {
                            boxShadow: '0 0 14px rgba(0,0,0,0.16)',
                        },
                    },
                    '& .MuiSlider-rail': {
                        height: 8,
                        opacity: "38%",
                        backgroundColor: 'rgb(171,215,250)',
                    },
                    '& .MuiSlider-track': {
                        height: 8,
                        backgroundColor: '#1976d2',
                    }
                }}
            />
        </Box>
    );
}
