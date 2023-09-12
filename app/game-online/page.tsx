"use client";

import React, { useState, useEffect, useRef } from "react";
import { io as ClientIO } from "socket.io-client";
import { Background, Player } from "../game/page";

interface IChatMessage {
    userName: string;
    message: string;
}

// component
const Index: React.FC = () => {
    const inputRef = useRef(null);

    // connected flag
    const [connected, setConnected] = useState<boolean>(false);

    // init chat and message
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const [userNameInput, setUserNameInput] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    const [chatMessagesObj, setChatMessagesObj] = useState<Record<string, string>>({});

    // dispatch message to other users
    const sendApiSocketChat = async (
        chatMessage: IChatMessage
    ): Promise<Response> => {
        return await fetch("/api/socket/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatMessage),
        });
    };

    const sendMessage = async () => {
        if (messageInput) {
            const chatMessage: IChatMessage = {
                userName,
                message: messageInput,
            };

            const resp = await sendApiSocketChat(chatMessage);

            if (resp.ok) setMessageInput("");
        }

        (inputRef?.current as any).focus();
    };

    const sendMessageDirect = async (message: string) => {
        if (message) {
            const chatMessage: IChatMessage = {
                userName,
                message,
            };

            const resp = await sendApiSocketChat(chatMessage);
        }

        // (inputRef?.current as any).focus();
    };


    const sendEnterRoomMessage = async () => {
        const chatMessage: IChatMessage = {
            userName: "",
            message: ``,
        };

        const resp = await sendApiSocketChat(chatMessage);
        if (!resp.ok) {
            setTimeout(() => {
                sendEnterRoomMessage();
            }, 500);
        }
    };

    useEffect((): any => {
        if (userName) {
            // sendEnterRoomMessage();
        }
    }, [userName]);

    useEffect((): any => {
        const socket = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        // log socket connection
        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);
            setConnected(true);
        });

        // update chat on new message dispatched
        socket.on("message", (message: IChatMessage) => {
            // chatMessages.push(message);
            // setChatMessages([...chatMessages]);

            chatMessagesObj[message.userName] = message.message;
            setChatMessagesObj({...chatMessagesObj});
        });

        // socket disconnet onUnmount if exists
        if (socket) return () => socket.disconnect();
    }, []);

    // useEffect(() => {
    //     let interval: any = null;

    //     if (userName) {
    //         let x = 0;
    //         let y = 0;
    //         let health = 100;

    //         interval = setInterval(() => {
    //             sendMessageDirect(`${x++}, ${y++}, ${health}`);
    //         }, 30);
    //     }

    //     return () => clearInterval(interval);
    // }, [userName]);

    if (!connected) {
        return (
            <></>
        );
    }

    if (!userName) {
        return (
            <div className="flex items-center p-4 mx-auto min-h-screen justify-center">
                <div className="gap-4 flex flex-col items-center justify-center w-full h-full">
                    <div className="flex flex-row flex-1 h-full divide-gray-200 dark:divide-gray-800 divide-x">
                        <label>
                            Name:
                            <input
                                type="text"
                                value={userNameInput}
                                className="w-full h-full rounded-lg shadow-lg mt-2 px-4 dark:bg-neutral-700 text-black dark:text-white outline-none"
                                disabled={!connected}
                                onChange={(e) => setUserNameInput(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        setUserName(userNameInput);
                                    }
                                }}
                                autoFocus
                            />
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    console.log(chatMessagesObj);

    return (
        <main className="w-full h-full">
            <Background />

            <Player
                id={"player-0"}
                isLeft={true}
                userName={userName}
                sendMessageDirect={sendMessageDirect}
                chatMessagesObj={chatMessagesObj}
            />
            
            <Player
                id={"player-1"}
                isLeft={false}
                userName={userName}
                sendMessageDirect={sendMessageDirect}
                chatMessagesObj={chatMessagesObj}
            />
            
        </main>
    )

    return (
        <>
            {/* {chatMessages.length > 1 && `${chatMessages[chatMessages.length - 1].userName}, ${chatMessages[chatMessages.length - 1].message}`} */}

            {/* {chatMessages.map((chatMessage, i) => (
                <div key={"msg_" + i} className="mt-1 text-black dark:text-white">
                    <span
                        className={
                            chatMessage.userName === userName
                                ? `text-red-500`
                                : `text-slate-800 dark:text-slate-200`
                        }
                    >
                        {chatMessage.userName === userName
                            ? "[Me]"
                            : `[${chatMessage.userName}]`}
                    </span>
                    : {chatMessage.message}
                </div>
            ))} */}
        </>
    );

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex flex-col flex-1 bg-slate-100 dark:bg-slate-900">
                <div className="flex-1 p-4 font-mono">
                    {chatMessages.length ? (
                        chatMessages.map((chatMessage, i) => (
                            <div key={"msg_" + i} className="mt-1 text-black dark:text-white">
                                <span
                                    className={
                                        chatMessage.userName === userName
                                            ? `text-red-500`
                                            : `text-slate-800 dark:text-slate-200`
                                    }
                                >
                                    {chatMessage.userName === userName
                                        ? "[Me]"
                                        : `[${chatMessage.userName}]`}
                                </span>
                                : {chatMessage.message}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-center text-gray-600 dark:text-gray-400 py-6">
                            No chat messages
                        </div>
                    )}
                </div>
                <div className="bg-slate-300 dark:bg-slate-950 p-4 h-20 sticky bottom-0">
                    <div className="flex flex-row flex-1 h-full divide-gray-200 dark:divide-gray-800 divide-x">
                        <div className="pr-2 flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageInput}
                                placeholder={connected ? "Type a message..." : "Connecting..."}
                                className="w-full h-full rounded shadow border px-2 border-gray-600 dark:border-gray-400 text-black dark:text-white"
                                disabled={!connected}
                                onChange={(e) => {
                                    setMessageInput(e.target.value);
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-stretch pl-2">
                            <button
                                className="bg-slate-50 dark:bg-slate-950 rounded shadow text-sm text-black dark:text-white h-full px-2"
                                onClick={() => {
                                    sendMessage();
                                }}
                                disabled={!connected}
                            >
                                SEND
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
