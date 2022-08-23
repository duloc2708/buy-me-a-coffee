import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function StickyFooter() {
  return (
      <Box
        component="footer"
        sx={{
          py: 1,
          px: 2,
          mt: 'auto',
          backgroundColor: 'black',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
              Powered by Ethereum, Alchemy, Next.js and IPFS

          </Typography>
        </Container>
      </Box>
  );
}