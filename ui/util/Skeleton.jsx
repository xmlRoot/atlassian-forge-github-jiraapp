import React from 'react';
import { Box, Stack, Spinner } from '@forge/react';

const CentralSpinner = () => (
    <Stack grow="fill" alignBlock="center" alignInline="center">
        <Stack space="space.1000" alignInline="center">
            <Box />
            <Box />
            <Spinner style={{ margin: "50px" }} label="loading" />
            <Box />
        </Stack>
    </Stack>
)

const Skeleton = ({ loading, children }) => {
    return loading ? <CentralSpinner /> : children
}

export default Skeleton;