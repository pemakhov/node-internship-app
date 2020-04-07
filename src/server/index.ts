import express from 'express';
import Router from '../config/Router';
import ServerConfigurator from './ServerConfigurator';
import Middleware from '../config/Middleware';
import Server from './Server';

const middleware: Middleware = new Middleware();
const routes: Router = new Router();
const server: Server = new Server(express(), middleware, routes);
const serverConfigurator: ServerConfigurator = new ServerConfigurator(server.app);

serverConfigurator.createServer();
