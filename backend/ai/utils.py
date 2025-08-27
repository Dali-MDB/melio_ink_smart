import os
import requests
from django.shortcuts import get_object_or_404
from posts.models import Post,Tag
from dotenv import load_dotenv

load_dotenv()

class TagsAi:
    def __init__(self,post:Post):
        self.API_URL =  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli"
        self.headers = {
            "Authorization": f"Bearer {os.getenv('HF_TOKEN')}",
        }
        self.post = post
    def query(self,payload):
        response = requests.post(self.API_URL, headers=self.headers, json=payload)
        return response.json()
    def get_tags(self):
        tags = list(Tag.objects.all().values_list('name',flat=True))
        output = self.query({
            "inputs": self.post.content,
            "parameters": {"candidate_labels": tags},
        })
        labels = output['labels']
        scores = output['scores']
        rslt = {}
        for i in range(3):
            rslt[labels[i]] = scores[i]
        return rslt



class SummaryAi:
    def __init__(self,post):
        self.API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
        self.headers = {
            "Authorization": f"Bearer {os.getenv('HF_TOKEN')}",
        }
        self.post = post
        self.max_length = 2048

    def query(self,payload):
        response = requests.post(self.API_URL, headers=self.headers, json=payload)
        return response.json()
    
    def get_summary(self):
        txt = self.post.content

        splitted = txt.split('\n')
        splitted = [x for x in splitted if len(x) > 2]
        total = len(splitted)
        i =0
        input_text = []
        while i<total:
            current = splitted[i]
            stop = True   #to handle the last item 
            for j in range(i+1,total):
                stop = False
                if len(current) + len(splitted[j]) < self.max_length:
                    current += splitted[j]
                    if j==total-1:
                        stop = True
                else:  
                    i = j  #next position to start from
                    break

            
            input_text.append(current)
            if stop:
                break
        summary = ''
        for sentence in input_text:
            length = len(sentence)
            result = self.query({
            "inputs": sentence,
            "parameters":{
                    "max_length":  int(length) ,
                    "min_length":  int(length/4),  
                }
        })
            
            summary += str(result[0]["summary_text"]) + '\n'

        return summary

            