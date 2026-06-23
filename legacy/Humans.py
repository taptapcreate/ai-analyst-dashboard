import streamlit as st
from PIL import Image
from utils import init_app, get_gemini_response, inject_custom_styles, wrap_in_glass

# Initialize App and Styles
init_app()
inject_custom_styles(primary_color="#2e7d32")

# Initialize Session State
if "age" not in st.session_state:
    st.session_state.age = 25
if "weight" not in st.session_state:
    st.session_state.weight = 70.0
if "height" not in st.session_state:
    st.session_state.height = 170
if "last_uploaded_file" not in st.session_state:
    st.session_state.last_uploaded_file = None

def estimate_health_metrics(image):
    """Uses Gemini to estimate Age, Weight, and Height from a photo."""
    prompt = """
    Analyze this image of a human and estimate their:
    - Age (years)
    - Weight (kg)
    - Height (cm)

    IMPORTANT: If no human is present, respond with 'ERROR: No human detected'.
    Otherwise, respond ONLY in the following format:
    AGE: [number]
    WEIGHT: [number]
    HEIGHT: [number]
    """
    
    response_text, _ = get_gemini_response(prompt, image)
    
    if response_text and "AGE:" in response_text:
        try:
            lines = response_text.strip().split('\n')
            for line in lines:
                if "AGE:" in line:
                    val = ''.join(c for c in line if c.isdigit())
                    if val: st.session_state.age = int(val)
                elif "WEIGHT:" in line:
                    val = ''.join(c for c in line if c.isdigit() or c == '.')
                    if val: st.session_state.weight = float(val)
                elif "HEIGHT:" in line:
                    val = ''.join(c for c in line if c.isdigit())
                    if val: st.session_state.height = int(val)
            return True
        except Exception:
            return False
    return False

# App UI
st.set_page_config(page_title="Humans AI Health Analyst", layout="wide", page_icon="🥗")
st.title("🥗 Humans: AI Health Analyst")
st.markdown("### Ignite your fitness journey with AI-powered insights.")

# Sidebar for User Specifications
with st.sidebar:
    st.header("👤 Your Profile")
    age = st.number_input("Age", min_value=10, max_value=100, value=st.session_state.age)
    weight = st.number_input("Weight (kg)", min_value=30.0, max_value=200.0, value=st.session_state.weight)
    height = st.number_input("Height (cm)", min_value=100, max_value=250, value=st.session_state.height)
    
    st.session_state.age, st.session_state.weight, st.session_state.height = age, weight, height
    goal = st.selectbox("Your Goal", ["Lose Weight", "Gain Muscle", "Maintenance", "Get Toned"])
    
    bmi = weight / ((height/100)**2)
    st.markdown("---")
    st.metric("Your BMI", f"{bmi:.1f}")
    if bmi < 18.5: st.warning("Category: Underweight")
    elif 18.5 <= bmi < 25: st.success("Category: Normal")
    elif 25 <= bmi < 30: st.warning("Category: Overweight")
    else: st.error("Category: Obese")

col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("#### 📸 Step 1: Upload Profile")
    uploaded_file = st.file_uploader("Upload a full-body photo", type=["jpg", "jpeg", "png"])
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Profile", use_container_width=True)
        
        if uploaded_file.name != st.session_state.last_uploaded_file:
            with st.spinner("🔍 Estimating metrics..."):
                estimate_health_metrics(image)
                st.session_state.last_uploaded_file = uploaded_file.name
                st.rerun()

with col2:
    st.markdown("#### 🧠 Step 2: AI Analysis")
    
    if uploaded_file:
        analyze_btn = st.button("Generate My FitPlan")
        image = Image.open(uploaded_file) # Ensure image is available in this scope
    else:
        st.info("Upload photo to start.")
        analyze_btn = False
    
    if analyze_btn:
        prompt = f"""
        You are a strict Health & Vision Analyst.
        1. VALIDATE: If no human is present, respond ONLY with 'ERROR: No human detected'.
        2. ANALYZE: cross-reference physique with Weight: {weight}kg, Height: {height}cm, BMI: {bmi:.1f}.
        3. PLAN: Based on GOAL: {goal}, provide 3 meal tips and 3 exercises.
        """
        
        with st.spinner("🚀 Analyzing..."):
            response_text, result = get_gemini_response(prompt, image)
            
            if response_text:
                if "ERROR:" in response_text:
                    st.error(response_text)
                else:
                    st.success(f"✅ Analysis Complete! (via {result})")
                    wrap_in_glass(response_text)
            else:
                st.error(f"❌ Error: {result}")
