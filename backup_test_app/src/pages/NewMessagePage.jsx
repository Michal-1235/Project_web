import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addMessage, getMessages } from "../services/messageService";


function NewMessagePage({ setMessages }) {    
    const navigate = useNavigate();
    const messageText = useRef(null);

    function publishNewMessage() {    
        addMessage({
            "id": crypto.randomUUID(),
            "user_id": "sampleUser123",
            "avatar": "images/person-circle.svg",           
            "text": messageText.current.value
        });  
        
        // setMessages(getMessages());
        navigate("/");
    }
        
    return (<>
        <div className="row">
            <div className="col">
                <textarea 
                ref={messageText} 
                id="message-text"></textarea>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <button className="btn btn-primary" 
                onClick={publishNewMessage}>Submit</button>
            </div>
        </div>
    </>);
}

export default NewMessagePage;