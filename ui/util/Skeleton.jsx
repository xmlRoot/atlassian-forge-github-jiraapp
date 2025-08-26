import React from 'react';
import { Box, Stack, Spinner } from '@forge/react';

const CentralSpinner = ({ centered }) => !centered 
   ? <Spinner label="loading" />
   : (
    <Stack grow="fill" alignBlock="center" alignInline="center">
        <Stack space="space.1000" alignInline="center">
            <Box />
            <Box />
            <Spinner style={{ margin: "50px" }} label="loading" />
            <Box />
        </Stack>
    </Stack>
)

const Skeleton = ({ loading, centered = false, children }) => {
    return loading ? <CentralSpinner centered={centered} /> : children
}

export default Skeleton;