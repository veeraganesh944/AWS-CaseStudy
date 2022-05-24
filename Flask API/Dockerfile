FROM python:latest
WORKDIR /flask-first-app-master
ADD . /flask-first-app-master
RUN pip3 install -r requirements.txt
ENV ACCESS_KEY=AKIAQY4BAQBOCI6BDHHV
ENV SECRET_KEY=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
EXPOSE 8081
CMD ["python","app.py"]