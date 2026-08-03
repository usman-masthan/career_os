"use client";import {useEffect} from "react";import SystemState from "./components/SystemState";
export default function Error({error,reset}){useEffect(()=>{console.error(error)},[error]);return <SystemState state="error" onRetry={reset}/>}
