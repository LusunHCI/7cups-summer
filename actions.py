# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"



from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher



# class ActionStressorTips(Action):

#     def name(self) -> Text:
#         return "action_stressor_tips"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#     	buttons=[]
#     	buttons.append({"title": "Get A Tip From Your Mentor", "payload": "I want some tips"})
#     	dispatcher.utter_message(template="utter_stressor",buttons=buttons)
#     	return []

# class ActionHelloWorld2(Action):

#     def name(self) -> Text:
#         return "action_hello_world2"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#         buttons=[]
#         buttons.append({"title": "get listening tips", "payload": "show me tips"})
#         dispatcher.utter_message(template="utter_conventional_opening",buttons=buttons)
#         return []

class ActionMyFallBack(Action):

    def name(self) -> Text:
        return "action_my_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Sorry I don't understand")
        return []


class ActionAskForAdvice(Action):

    def name(self) -> Text:
        return "action_ask_for_advice"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons=[]
        buttons.append({"title": "Sure, let me tell you how I think you get through this anxiety. I can give you some advice on this.", "payload": "Sure, let me tell you how I think you get through this anxiety. I can give you some advice on this."})
        buttons.append({"title": "You are the expert on you. My advice might end up being unhelpful and I don’t want to do that.", "payload": "You are the expert on you. My advice might end up being unhelpful and I don’t want to do that."})
        dispatcher.utter_message(text="Seems you have the same experience as me, could you please give me some advice on how to tackle it?",buttons=buttons)
        return []

class ActionAskPersonalInfo(Action):

    def name(self) -> Text:
        return "action_ask_personal_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons=[]
        buttons.append({"title": "Sure, my phone number is xxx-xxx-xxxx. I am happy to talk or meet with you in person.", "payload": "Sure, my phone number is xxx-xxx-xxxx. I am happy to talk or meet with you in person."})
        buttons.append({"title": "Sorry, I cannot give members my personal information. Please feel free to chat with me on 7cups website. I am always here to listen.", "payload": "Sorry, I cannot give members my personal information. Please feel free to chat with me on 7cups website. I am always here to listen."})
        dispatcher.utter_message(text="You are so nice. Do you mind giving me your phone number and then we can chat during the weekend?",buttons=buttons)
        return []

class ActionSuicide(Action):

    def name(self) -> Text: 
        return "action_suicide"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons=[]
        buttons.append({"title": "Try to convince him not to", "payload": "You had better not. You will regret if you do that."})
        buttons.append({"title": "Make a referral to the professional therapist", "payload": "Sorry, this situation is beyound my ability. I will make a referral to professional therapist as soon as possible. "})
        dispatcher.utter_message(text="No I don't want to hear now. You have no idea what I have been through at all. I feel so frustrated, there is no need for me to be alive in this world. This break up is killing me.",buttons=buttons)
        return []



# class ActionSorry(Action):

#     def name(self) -> Text:
#             return "i am sorry to hear that"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#         return []

# class ActionReflect(Action):

#     def name(self) -> Text:
#             return "you broke up with your boyfriend"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#         return []

