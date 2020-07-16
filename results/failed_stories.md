## happy path 1 (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* greet: hello there!   <!-- predicted: greeting: hello there! -->
    - utter_greet   <!-- predicted: utter_greeting -->
* mood_great: amazing   <!-- predicted: greeting: amazing -->
    - utter_happy   <!-- predicted: utter_greeting -->


## happy path 2 (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* greet: hello there!   <!-- predicted: greeting: hello there! -->
    - utter_greet   <!-- predicted: utter_greeting -->
* mood_great: amazing   <!-- predicted: greeting: amazing -->
    - utter_happy   <!-- predicted: utter_greeting -->
* goodbye: bye-bye!   <!-- predicted: conventional_close: bye-bye! -->
    - utter_goodbye   <!-- predicted: utter_conventional_close -->


## sad path 1 (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* greet: hello   <!-- predicted: greeting: hello -->
    - utter_greet   <!-- predicted: utter_greeting -->
* mood_unhappy: not good   <!-- predicted: conventional_close: not good -->
    - utter_cheer_up   <!-- predicted: utter_conventional_close -->
    - utter_did_that_help   <!-- predicted: action_listen -->
* affirm: yes   <!-- predicted: greeting: yes -->
    - utter_happy   <!-- predicted: utter_greeting -->


## sad path 2 (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* greet: hello   <!-- predicted: greeting: hello -->
    - utter_greet   <!-- predicted: utter_greeting -->
* mood_unhappy: not good   <!-- predicted: conventional_close: not good -->
    - utter_cheer_up   <!-- predicted: utter_conventional_close -->
    - utter_did_that_help   <!-- predicted: action_listen -->
* deny: not really   <!-- predicted: suggestion_cry: not really -->
    - utter_goodbye   <!-- predicted: utter_suggestion_cry_accept -->


## sad path 3 (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* greet: hi   <!-- predicted: greeting: hi -->
    - utter_greet   <!-- predicted: utter_greeting -->
* mood_unhappy: very terrible   <!-- predicted: encourage_self: very terrible -->
    - utter_cheer_up   <!-- predicted: action_my_fallback -->
    - utter_did_that_help   <!-- predicted: action_listen -->
* deny: no   <!-- predicted: greeting: no -->
    - utter_goodbye   <!-- predicted: utter_greeting -->


## say goodbye (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* goodbye: bye-bye!   <!-- predicted: conventional_close: bye-bye! -->
    - utter_goodbye   <!-- predicted: utter_conventional_close -->


## bot challenge (/var/folders/_f/t84jb2y94kl1psl2z1kzwfnr0000gn/T/tmpvw4_6m2a/cb5fa429d6b546b6b081ab0f911cc41c_conversation_tests.md)
* bot_challenge: are you a bot?   <!-- predicted: conventional_opening: are you a bot? -->
    - utter_iamabot   <!-- predicted: action_my_fallback -->


