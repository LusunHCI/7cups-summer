## general no advice path
* greeting
  - utter_greeting
* age_inquiry
  - utter_age
* stressor_inquiry_time OR stressor_inquiry
  - utter_stressor1
  - utter_stressor2
* label_emotion_stressor_introduction OR reflection_stressor_introduction OR condolence_stressor_introduction OR stressor_inquiry_feelings
  - utter_feelings
* stressor_inquiry_when
  - utter_breakup_when
* stressor_inquiry_further_details
  - utter_further_details
* label_emotion_detail OR reflection_reunion_detail OR condolence_reunion_detail OR empathy_reunion_detail OR further_contact_inquiry
  - utter_further_contact
* reflection_further_contact OR condolence_further_contact OR empathy_further_contact
  - utter_feelings_further_pushy_flirty
  - utter_feelings_further_living_lie
* label_emotion_conflicting OR commitment_inquiry
  - utter_commitment
* support_user_side
  - utter_longing
* empathy_longing
  - utter_jealousy
* empathy_jealousy OR label_emotion_jealous OR encourage_self
  - utter_blame_on_ex
* condolence_lack_of_closure
  - utter_shut_out
* encourage_healing_and_overcoming
  - utter_hope_to_move_on
* encourage_learning_from_this_experience
  - utter_personal_info_inquiry
* reject_personal_info
  - utter_gratitude
* end_conversation
  - utter_end_conversation

## advice path
* greeting
  - utter_greeting
* age_inquiry
  - utter_age
* stressor_inquiry_time OR stressor_inquiry
  - utter_stressor1
  - utter_stressor2
* empathy_stressor_introduction
  - utter_advice_inquiry
  _ action_advice
* stressor_inquiry_feelings
  - utter_feelings
* stressor_inquiry_when
  - utter_breakup_when
* stressor_inquiry_further_details
  - utter_further_details
* label_emotion_detail OR reflection_reunion_detail OR condolence_reunion_detail OR empathy_reunion_detail OR further_contact_inquiry
  - utter_further_contact
* reflection_further_contact OR condolence_further_contact OR empathy_further_contact
  - utter_feelings_further_pushy_flirty
  - utter_feelings_further_living_lie
* label_emotion_conflicting OR commitment_inquiry
  - utter_commitment
* support_user_side
  - utter_longing
* empathy_longing
  - utter_jealousy
* empathy_jealousy OR label_emotion_jealous OR encourage_self
  - utter_blame_on_ex
* condolence_lack_of_closure
  - utter_shut_out
* encourage_healing_and_overcoming
  - utter_hope_to_move_on
* encourage_learning_from_this_experience
  - utter_personal_info_inquiry
* reject_personal_info
  - utter_gratitude
* end_conversation
  - utter_end_conversation


