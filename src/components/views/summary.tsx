"use client"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useState } from "react"
import MostLike from "./most/most-like"
import MostChat from "./most/most-chat"
import MostWord from "./most/most-word"
import MostActivity from "./most/most-activity"

export default function MenuBarChart() {
    const [topMostLikes, setTopMostLikes] = useState(false)
    const [mostChat, setMostChat] = useState(false)
    const [mostWords, setMostWords] = useState(false)
    const [mostActivity, setMostActivity] = useState(false)
    return (
        <>
            <Menubar className="mt-2 w-fit">
                <MenubarMenu>
                    <MenubarTrigger>Summary</MenubarTrigger>
                    <MenubarContent>
                        <MenubarSub>
                            <MenubarSubTrigger>Chat</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setMostChat(true)}>Most Chat</MenubarItem>
                                <MenubarItem onClick={() => setMostWords(true)}>Most Word</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Likes</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setTopMostLikes(true)}>Top & Most Likes</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Gift</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem disabled>Most Gift</MenubarItem>
                                <MenubarItem disabled>Top Gift</MenubarItem>
                                <MenubarItem disabled>Top & Most Giver</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Viewer</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setMostActivity(true)}>Most Activity</MenubarItem>
                                <MenubarItem disabled>Top Viewer</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                    </MenubarContent>
                </MenubarMenu>
                <MostLike open={topMostLikes} setOpen={setTopMostLikes} />
                <MostChat open={mostChat} setOpen={setMostChat} />
                <MostWord open={mostWords} setOpen={setMostWords} />
                <MostActivity open={mostActivity} setOpen={setMostActivity} />
            </Menubar>
        </>)
}