import streamlit as st
from PIL import Image
from utils import init_app, get_gemini_response, inject_custom_styles, wrap_in_glass

# Initialize App and Styles
init_app()
inject_custom_styles(primary_color="#E65100", secondary_gradient="linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)")

# Initialize Session State
if "breed" not in st.session_state:
    st.session_state.breed = "Unknown"
if "last_uploaded_file" not in st.session_state:
    st.session_state.last_uploaded_file = None

def identify_breed(image, animal_type):
    """Uses AI to identify the breed/variety of the animal."""
    prompt = f"Identify the specific breed or variety of this {animal_type}. Respond ONLY with the name (e.g., Golden Retriever). If unsure, respond 'Unknown'."
    response_text, _ = get_gemini_response(prompt, image)
    if response_text and "ERROR" not in response_text:
        return response_text.strip()
    return "Unknown"

# App UI
st.set_page_config(page_title="AnimalFit AI", layout="wide", page_icon="🐾")
st.title("🐾 AnimalFit: AI Pet & Cattle Health Analyst")
st.markdown("### Optimize your animal's health with AI-powered diet and routine plans.")

# Sidebar for Animal Specifications
with st.sidebar:
    st.header("🐾 Animal Profile")
    animal_type = st.selectbox("Animal Type", ["Dog", "Cat", "Cattle", "Horse", "Sheep/Goat", "Others"])
    
    # Use session state for breed to allow autofill
    breed = st.text_input("Breed/Variety", value=st.session_state.breed)
    st.session_state.breed = breed # Sync back manual changes
    
    age = st.number_input("Age (Years/Months)", min_value=0.1, max_value=50.0, value=2.0, step=0.1)
    weight = st.number_input("Weight (kg)", min_value=0.1, max_value=2000.0, value=10.0)
    
    st.markdown("---")
    goal = st.selectbox("Health Goal", [
        "Healthy Growth", 
        "Weight Management", 
        "Energy/Performance", 
        "Recovery/Supplementation",
        "Daily Maintenance"
    ])
    st.info(f"Analyzing {animal_type} - {breed}")

col1, col2 = st.columns([1, 1])

with col1:
    st.markdown(f"#### 📸 Step 1: Upload {animal_type} Photo")
    uploaded_file = st.file_uploader(f"Upload photo of your {animal_type}", type=["jpg", "jpeg", "png"])
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption=f"Uploaded {animal_type}", use_container_width=True)
        
        # Trigger Breed Identification
        if uploaded_file.name != st.session_state.last_uploaded_file:
            with st.spinner(f"🔍 Identifying {animal_type} breed..."):
                st.session_state.breed = identify_breed(image, animal_type)
                st.session_state.last_uploaded_file = uploaded_file.name
                st.rerun()

with col2:
    st.markdown("#### 🧠 Step 2: AI Health Analysis")
    if uploaded_file:
        analyze_btn = st.button(f"Generate {animal_type} HealthPlan")
        image = Image.open(uploaded_file) # Ensure image is available
    else:
        st.info("Upload photo to start.")
        analyze_btn = False
    
    if analyze_btn:
        prompt = f"""
        You are a professional Veterinary & Animal Nutrition Analyst.
        1. VALIDATE: If image is NOT an animal (e.g., human, object), respond ONLY with 'ERROR: No {animal_type} detected'.
        2. ANALYZE: cross-reference appearance with Animal: {animal_type}, Breed: {breed}, Age: {age}, Weight: {weight}kg.
        3. PLAN: provide 3 meal recommendations and 3 routine/exercise suggestions.
        """
        
        with st.spinner(f"🚀 Analyzing {animal_type}..."):
            response_text, result = get_gemini_response(prompt, image)
            
            if response_text:
                if "ERROR:" in response_text:
                    st.error(response_text)
                else:
                    st.success(f"✅ Analysis Complete! (via {result})")
                    wrap_in_glass(response_text)
            else:
                st.error(f"❌ Error: {result}")
