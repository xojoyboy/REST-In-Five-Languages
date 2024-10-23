# Python Server Setup

## Prerequisites
- Python 3.x
- `pip` (Python package installer)

## Setup Instructions

### 1. Create a Virtual Environment

#### On macOS/Linux
```sh
python3 -m venv venv
source venv/bin/activate
```

#### On Windows
```sh
python -m venv venv
venv\Scripts\activate
```

### 2. Install Dependencies
The server requires the `flask` package to run. You can install the dependencies using the following command:
```sh
pip install -r requirements.txt
```

### 3. Run the Server
```sh
python server.py
```

#### Additional Notes
<ul>
<li> Ensure that the virtual environment is activated before running the server.</li>
<li> The server will run on port 5002. You can change this if you want in the python code, please dont, there is no need</li>
</ul>


