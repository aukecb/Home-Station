FROM python:3
RUN apt-get update && apt-get install -y --no-install-recommends \
gdal-bin
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/

RUN chmod +x /code/docker-entrypoint.sh
ENTRYPOINT [ "/code/docker-entrypoint.sh"]
