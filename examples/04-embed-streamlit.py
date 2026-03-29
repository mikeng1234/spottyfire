import streamlit as st
from pathlib import Path

st.set_page_config(page_title="SpottyFire Dashboard", layout="wide")
st.title("SpottyFire in Streamlit")
st.components.v1.html(
    Path("examples/02-full-dashboard.html").read_text(),
    height=900,
    scrolling=True,
)
