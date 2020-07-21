# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"



from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher



# class ActionHelloWorld(Action):

#     def name(self) -> Text:
#         return "action_hello_world"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#     	buttons=[]
#     	buttons.append({"title": "reflect", "payload": "Your boyfriend broke up with you"})
#     	buttons.append({"title": "condolences", "payload": "I'm sorry to hear that"})
#     	dispatcher.utter_message(template="utter_conventional_opening",buttons=buttons)
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

