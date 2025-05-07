# ai_generator.py
import openai

openai.api_key = '...'  # move to env variable

def generate_ai_questions(level="B1"):
    prompt = f"Generate 5 multiple-choice English questions for level {level}. Format: Question + 4 options + correct one."

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
