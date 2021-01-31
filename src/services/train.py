import numpy as np
import random
import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from nltk_utils import bag_of_words, tokenize, stem
from model import NeuralNet

with open('intents.json','r') as f:
    intents = json.load(f)

all_words, tags, xy = [],[],[]
for intent in intents['intents']:   # Iterate through each intent which consists of a tag, pattern of text, bot response
    tags.append(intent['tag'])      # Get all tags
    for pattern in intent['patterns']:      # Iterate through every user input possabilities
        tkn = tokenize(pattern)             # tokenize the user input possabilities
        all_words.extend(tkn)               # use extend instead of append to avoid getting an array of array (avoid flattening later)
        xy.append((tkn,intent['tag']))      # (x,y) pair with input tokens and their respective tags

to_ignore = ['?','!','.',',','the', 'is', 'as', 'a', 'are', 'in', 'this', 'that']    # Some stop words and useless characters
all_words = sorted(set([stem(wrd) for wrd in all_words if wrd not in to_ignore]))    # Apply stemming to all words and remove duplicates
tags = sorted(set(tags))    # Incase we add duplicate tags, not necessary but good practice


X_train, y_train = [], []
for (pattern_sentence, tag) in xy:
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Hyper-parameters 
num_epochs = 1000
batch_size = 8
learning_rate = 0.001
hidden_size = 8

input_size = len(X_train[0])
output_size = len(tags)
print(input_size, output_size)

class ChatDataset(Dataset):
    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,batch_size=batch_size,shuffle=True,num_workers=0)
model = NeuralNet(input_size, hidden_size, output_size)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Train the model
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        labels = labels.to(dtype=torch.long)
        
        # Forward 
        outputs = model(words)
        loss = criterion(outputs, labels)
        
        # Backward / optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print (f'Epoch :{epoch+1}/{num_epochs}, loss: {loss.item():.4f}')


print(f'final loss: {loss.item():.4f}')

data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)
print(f'training complete. file saved to {FILE}')