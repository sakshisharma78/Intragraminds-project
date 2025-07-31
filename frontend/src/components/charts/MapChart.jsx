import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { Box, useTheme } from '@mui/material';

// You can replace this with a more detailed map if needed
const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

export const MapChart = ({
  data = [],
  title = '',
  height = 400,
  markers = [],
  center = [0, 0],
  scale = 100
}) => {
  const theme = useTheme();

  // Create color scale based on values
  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.value))
    .range([
      theme.palette.primary[100],
      theme.palette.primary[200],
      theme.palette.primary[300],
      theme.palette.primary[400],
      theme.palette.primary[500]
    ]);

  return (
    <Box
      sx={{
        height,
        width: '100%',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      {title && (
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <ComposableMap
        projectionConfig={{
          scale,
          center
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const current = data.find((d) => d.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : theme.palette.grey[200]}
                    stroke={theme.palette.grey[300]}
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none'
                      },
                      hover: {
                        fill: theme.palette.primary.main,
                        outline: 'none',
                        cursor: 'pointer'
                      },
                      pressed: {
                        fill: theme.palette.primary.dark,
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
          {markers.map(({ name, coordinates, value }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle
                r={value ? Math.sqrt(value) * 2 : 5}
                fill={theme.palette.secondary.main}
                stroke={theme.palette.common.white}
                strokeWidth={2}
                style={{
                  cursor: 'pointer'
                }}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
};