FROM google/nodejs
COPY . /src
EXPOSE  3000
RUN cd /src && npm install
WORKDIR /src
CMD ["npm", "start"]
