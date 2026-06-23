import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv

def init_app():
    """Initializes API environment and Gemini configuration."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        st.error("🚨 GEMINI_API_KEY not found! Please check your .env file.")
        st.stop()
    genai.configure(api_key=api_key)
    return api_key

def get_gemini_response(prompt, image):
    """Attempts to get a response from Gemini, using the requested models and fallbacks."""
    models_to_try = [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-pro-vision',
        'gemini-flash-latest'
    ]
    
    last_error = None
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content([prompt, image])
            if response.text:
                return response.text, model_name
        except Exception as e:
            last_error = str(e)
            if any(code in last_error for code in ["404", "429", "RESOURCE_EXHAUSTED"]) or "not found" in last_error.lower():
                continue 
            continue
    return None, last_error

def inject_custom_styles(primary_color="#2e7d32", secondary_gradient="linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"):
    """Injects high-end Glassmorphism and modern UI styles."""
    st.markdown(f"""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        :root {{
            --primary: {primary_color};
            --glass-bg: rgba(255, 255, 255, 0.22);
            --glass-border: rgba(255, 255, 255, 0.3);
            --text-dark: #1e293b;
        }}

        .stApp {{
            background: {secondary_gradient};
            font-family: 'Outfit', sans-serif;
        }}

        /* The Glass Card Container */
        .glass-card {{
            background: var(--glass-bg);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-radius: 24px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.12);
            padding: 30px;
            margin-top: 25px;
            color: var(--text-dark);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }}
        
        .glass-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.18);
        }}

        /* Typography refinements */
        h1, h2, h3 {{
            font-family: 'Outfit', sans-serif !important;
            font-weight: 800 !important;
            color: var(--primary) !important;
        }}

        /* Custom Streamlit component styling */
        .stButton>button {{
            width: 100%;
            border-radius: 20px;
            height: 3.2em;
            background-color: var(--primary);
            color: white;
            font-weight: 600;
            border: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}

        .stButton>button:hover {{
            background-color: var(--primary);
            opacity: 0.9;
            transform: scale(1.03);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }}

        .stMetric {{
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }}
        
        .stFileUploader section {{
            border-radius: 20px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 2px dashed rgba(255, 255, 255, 0.3) !important;
        }}
        
        </style>
    """, unsafe_allow_html=True)

def wrap_in_glass(content):
    """Wraps content in a glass-card div."""
    st.markdown(f"""
        <div class="glass-card">
            {content}
        </div>
        """, unsafe_allow_html=True)
