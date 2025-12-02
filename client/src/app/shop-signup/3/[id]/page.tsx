import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Form from "../form";
import { cookies } from "next/headers";

type Props = {
    params: { id: string }; 
};