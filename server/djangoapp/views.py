from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import requests
import os
import json
import logging

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("backend_url", "http://localhost:3030")
SENTIMENT_ANALYZER_URL = os.getenv("sentiment_analyzer_url", "http://localhost:3030")

def call_backend(path):
    url = f"{BACKEND_URL}{path}"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        logger.error(f"Backend call failed: {e}")
        return None

def analyze_sentiment(text):
    url = f"{SENTIMENT_ANALYZER_URL}/analyze"
    try:
        res = requests.post(url, json={"text": text}, timeout=10)
        res.raise_for_status()
        return res.json().get("sentiment", "neutral")
    except Exception as e:
        logger.error(f"Sentiment call failed: {e}")
        return "neutral"

@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"status": "Failed", "message": "Only POST method is allowed."})
    try:
        data = json.loads(request.body)
        username = data.get("userName")
        password = data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        return JsonResponse({"userName": username, "status": "Failed", "message": "Invalid username or password."})
    except Exception as e:
        return JsonResponse({"status": "Failed", "message": str(e)})

def logout_request(request):
    logout(request)
    return JsonResponse({"userName": "", "status": 200})

@csrf_exempt
def registration(request):
    if request.method != "POST":
        return JsonResponse({"status": "Failed", "message": "Only POST method is allowed."})
    try:
        data = json.loads(request.body)
        username = data.get("userName")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        if not username or not password or not first_name or not last_name or not email:
            return JsonResponse({"status": "Failed", "message": "All fields are required."})
        if User.objects.filter(username=username).exists():
            return JsonResponse({"status": "Failed", "message": "Username already exists."})
        if User.objects.filter(email=email).exists():
            return JsonResponse({"status": "Failed", "message": "Email already exists."})
        user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
        user.save()
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return JsonResponse({"status": "Failed", "message": str(e)})

def get_dealerships(request):
    dealers = call_backend("/fetchDealers")
    return JsonResponse({"status": 200, "dealers": dealers or []})

def get_dealerships_by_state(request, state):
    dealers = call_backend(f"/fetchDealers/{state}")
    return JsonResponse({"status": 200, "dealers": dealers or []})

def get_dealer_reviews(request, dealer_id):
    reviews = call_backend(f"/fetchReviews/dealer/{dealer_id}")
    return JsonResponse({"status": 200, "reviews": reviews or []})

def get_dealer_details(request, dealer_id):
    dealer = call_backend(f"/fetchDealer/{dealer_id}")
    return JsonResponse({"status": 200, "dealer": dealer or {}})

@csrf_exempt
def add_review(request):
    try:
        data = json.loads(request.body)
        url = f"{BACKEND_URL}/insert_review"
        res = requests.post(url, json=data, timeout=10)
        res.raise_for_status()
        saved = res.json()
        sentiment = analyze_sentiment(data.get("review", ""))
        saved["sentiment"] = sentiment
        return JsonResponse({"status": 200, "review": saved})
    except Exception as e:
        logger.error(f"Add review failed: {e}")
        return JsonResponse({"status": "error"}, status=500)

def get_cars(request):
    carmodels = [
        {"CarMake": "Audi", "CarModel": "A4"},
        {"CarMake": "Audi", "CarModel": "A6"},
        {"CarMake": "BMW", "CarModel": "3 Series"},
        {"CarMake": "BMW", "CarModel": "5 Series"},
        {"CarMake": "Toyota", "CarModel": "Camry"},
        {"CarMake": "Toyota", "CarModel": "Corolla"},
        {"CarMake": "Honda", "CarModel": "Civic"},
        {"CarMake": "Honda", "CarModel": "Accord"},
        {"CarMake": "Ford", "CarModel": "Mustang"},
        {"CarMake": "Ford", "CarModel": "F-150"},
        {"CarMake": "Nissan", "CarModel": "Altima"},
        {"CarMake": "Nissan", "CarModel": "Sentra"},
        {"CarMake": "Chevrolet", "CarModel": "Camaro"},
        {"CarMake": "Chevrolet", "CarModel": "Silverado"},
        {"CarMake": "Jeep", "CarModel": "Wrangler"},
        {"CarMake": "Jeep", "CarModel": "Cherokee"},
    ]
    return JsonResponse({"CarModels": carmodels})