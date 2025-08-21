import {Box, Spinner, Stack} from "@forge/react";
import React, {createContext, useContext, useState} from "react";


export const Loader = () =>
    <Box>
        <Spinner size="large"/>
    </Box>

const Layout = ({children}) => {
    return (
        <Stack grow="fill" alignBlock="center" alignInline="center" space={"space.1000"}>
            <Stack space="space.1000" alignInline="center">
                {children}
            </Stack>
        </Stack>
    )
}

export default Layout;