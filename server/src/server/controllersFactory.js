/**
 * Copyright (c) 2016-present, Facebook, Inc. All rights reserved.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */

import type Application from '../services/Application';
import type {ControllerInterface} from './controllers/ControllerInterface';
import type {RequestMethod} from 'express';

const HttpStatus = require('http-status-codes');
const methods = require('methods');
const {List, Set} = require('immutable');

// controllers
const ConfigController = require('./controllers/ConfigController');
const HttpErrorController = require('./controllers/HttpErrorController');
const MeController = require('./controllers/user/MeController');
const RoutineListController = require('./controllers/routine/RoutineListController');
const RoutineReadController = require('./controllers/routine/RoutineReadController');
const ScheduleCreateController = require('./controllers/schedule/ScheduleCreateController');
const ScheduleListController = require('./controllers/schedule/ScheduleListController');
const ScheduleReadController = require('./controllers/schedule/ScheduleReadController');
const ScheduleUpdateController = require('./controllers/schedule/ScheduleUpdateController');
const ScriptCreateController = require('./controllers/script/ScriptCreateController');
const ScriptListController = require('./controllers/script/ScriptListController');
const ScriptReadController = require('./controllers/script/ScriptReadController');
const ScriptUpdateController = require('./controllers/script/ScriptUpdateController');

const getHttpMethods = function(): Set<RequestMethod> {
  return new Set(methods);
};

const controllersFactory = function(app: Application): List<ControllerInterface> {
  return new List([
    new ConfigController(app),
    new MeController(app),
    new RoutineListController(app),
    new RoutineReadController(app),
    new ScheduleCreateController(app),
    new ScheduleListController(app),
    new ScheduleReadController(app),
    new ScheduleUpdateController(app),
    new ScriptCreateController(app),
    new ScriptListController(app),
    new ScriptReadController(app),
    new ScriptUpdateController(app),
    new HttpErrorController(app, app.getAllowedRequestMethods(), HttpStatus.NOT_FOUND),
    new HttpErrorController(app, getHttpMethods(), HttpStatus.METHOD_NOT_ALLOWED)
  ]);
};

module.exports = controllersFactory;
