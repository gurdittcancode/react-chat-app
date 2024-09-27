import { FC, useEffect, useState } from "react";

const Chat: FC = () => {
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [user, setUser] = useState<{
        name: string;
        messages: {
            name: string;
            message: string;
        }[];
    }>({
        name: "gurditt",
        messages: [],
    });

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");
        socket.onopen = () => {
            console.log("Connected");
            setSocket(socket);
        };

        socket.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            console.log("Received message: ", message);
            setUser((prev) => ({
                ...prev,
                messages: [...prev.messages, message],
            }));
        };

        return () => {
            socket.close();
        };
    }, []);

    if (!socket) {
        return <div>Connecting to socket...</div>;
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setMessage("");
        const msg = {
            name: user.name,
            message: message,
        };
        socket.send(JSON.stringify(msg));
    };

    return (
        <div className="w-1/2 max-w-[410px] bg-white px-3 py-4 flex flex-col items-center shadow-xl rounded-xl">
            <div>
                <div className="flex items-center gap-3">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        value={user.name}
                        className="border-gray-200 border px-3 py-2 rounded-lg"
                        onChange={(ev) =>
                            setUser({ ...user, name: ev.target.value })
                        }
                    />
                </div>
            </div>
            <div className="w-full mt-5">
                <ul>
                    {user.messages.map((msg) => (
                        <li className="flex w-full items-center gap-2">
                            {msg.name === "serverahahahahahahahahaha" ? (
                                <>
                                    <div className="w-3/4 text-blue-400">
                                        {msg.message}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold w-1/4">
                                        {msg.name}
                                    </div>
                                    <div className="w-3/4">{msg.message}</div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-5 w-full ">
                <form onSubmit={handleSubmit} className="flex justify-evenly">
                    <input
                        name="message"
                        type="text"
                        value={message}
                        placeholder="type something..."
                        className="border w-1/2 p-2 rounded-xl"
                        onChange={(ev) => {
                            setMessage(ev.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        className="border py-2 px-5 bg-black text-white rounded-xl"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
