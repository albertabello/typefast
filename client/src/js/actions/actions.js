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

import type {Action, Dispatch, GetState, Thunk} from 'redux';

import fetch from 'isomorphic-fetch';

/******************************** COMMON **********************************/

function makeUrl(path: string, getState: Function, query: ?Object): string {
  const chunks = [];
  query = query || {};
  query.access_token = getState().accessToken;
  for (let i in query) {
    if (query.hasOwnProperty(i)) {
      chunks.push(encodeURIComponent(i) + '=' + encodeURIComponent(query[i]));
    }
  }
  return path + (chunks.length > 0 ? '?' : '') + chunks.join('&');
}

function makeFormData(object: Object, getState: Function): FormData {
  const form = new FormData();
  form.append('access_token', getState().accessToken);
  for (let i in object) {
    const value = typeof object[i] === 'object'
      ? JSON.stringify(object[i]) : object[i];
    form.append(i, value);
  }
  return form;
}

function handleErrors(response: Response, dispatch: Dispatch): Response {
  if (!response.ok) {
    if (response.status === 401) {
      dispatch(unauthorised());
    }
    throw Error(response.statusText);
  }
  return response;
}

function fetchData(dispatch: Dispatch): void {
  dispatch(fetchScripts());
  dispatch(fetchRoutines());
  dispatch(fetchSamples());
}

/******************************** FETCH **********************************/

export const FETCH_SCHEDULE_REQUEST = 'FETCH_SCHEDULE_REQUEST';
export const FETCH_SCHEDULE_SUCCESS = 'FETCH_SCHEDULE_SUCCESS';
export function fetchSchedule(script_id: string): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({type: FETCH_SCHEDULE_REQUEST});
    return fetch(
      makeUrl('/schedules', get_state, { script_id: script_id, queue_name: 'main' }), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
    .then(response => handleErrors(response, dispatch))
    .then(response => response.json())
    .then(response => dispatch({
      type: FETCH_SCHEDULE_SUCCESS,
      payload: {
        schedule: response.data,
      },
    }))
    .catch(excep => dispatch(showErrorModal(FETCH_SCHEDULE_REQUEST, excep.message)));
  };
}

export const FETCHING_ROUTINES_REQUEST = 'FETCHING_ROUTINES_REQUEST';
export const FETCHING_ROUTINES_SUCCESS = 'FETCHING_ROUTINES_SUCCESS';
export function fetchRoutines(): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({type: FETCHING_ROUTINES_REQUEST});
    return fetch(makeUrl('/routines', get_state, {queue_name: 'main'}))
      .then((response: Response) => handleErrors(response, dispatch))
      .then((response: Response) => response.json())
      .then((content: Object) => {
        dispatch({
          type: FETCHING_ROUTINES_SUCCESS,
          payload: {
            routines: content,
          },
        });
      })
      .catch(excep => dispatch(showErrorModal(FETCHING_ROUTINES_REQUEST, excep.message)));
  };
}

export const FETCHING_SCRIPTS_REQUEST = 'FETCHING_SCRIPTS_REQUEST';
export const FETCHING_SCRIPTS_SUCCESS = 'FETCHING_SCRIPTS_SUCCESS';
export function fetchScripts(): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({type: FETCHING_SCRIPTS_REQUEST});
    return fetch(makeUrl('/scripts', get_state))
      .then((response) => handleErrors(response, dispatch))
      .then((response: Response) => response.json())
      .then((content: Object) => {
        dispatch({
          type: FETCHING_SCRIPTS_SUCCESS,
          payload: {
            scripts: content,
          },
        });
        return content;
      })
      .then((content: Object) => {
        if (content.data.length > 0) {
          dispatch(loadScript(content.data[0].id));
        }
      })
      .catch(excep => dispatch(showErrorModal(FETCHING_SCRIPTS_REQUEST, excep.message)));
  };
}

/******************************** AUTH **********************************/

export const UNAUTHORISED = 'UNAUTHORISED';
export function unauthorised(): Action {
  return {
    type: UNAUTHORISED,
  };
}

export const FACEBOOK_AUTH_STARTED = 'FACEBOOK_AUTH_STARTED';
export function facebookAuthStarted(): Action {
  return {
    type: FACEBOOK_AUTH_STARTED,
  };
}

export const FACEBOOK_AUTH_SUCCESS = 'FACEBOOK_AUTH_SUCCESS';
export function facebookAuthSuccess(token: string): Thunk<void> {
  return function(dispatch: Dispatch, get_state: GetState): void {
    dispatch({
      type: FACEBOOK_AUTH_SUCCESS,
      payload: {
        accessToken: token,
      },
    });
    fetchData(dispatch);
  };
}

export const FACEBOOK_AUTH_FAILURE = 'FACEBOOK_AUTH_FAILURE';
export function facebookAuthFailure(): Action {
  return {
    type: FACEBOOK_AUTH_FAILURE,
  };
}

/******************************** OPEN SCRIPT *********************************/

export const SHOW_OPEN_SCRIPT_DIALOG = 'SHOW_OPEN_SCRIPT_DIALOG';
export function showOpenScriptDialog(): Action {
  return {
    type: SHOW_OPEN_SCRIPT_DIALOG,
  };
}

export const HIDE_OPEN_SCRIPT_DIALOG = 'HIDE_OPEN_SCRIPT_DIALOG';
export function hideOpenScriptDialog(): Action {
  return {
    type: HIDE_OPEN_SCRIPT_DIALOG,
  };
}

/******************************** HISTORY **********************************/

export const SHOW_RUN_HISTORY_MODAL = 'SHOW_RUN_HISTORY_MODAL';
export function showRunHistoryModal(): Action {
  return {
    type: SHOW_RUN_HISTORY_MODAL,
  };
}

export const HIDE_RUN_HISTORY_MODAL = 'HIDE_RUN_HISTORY_MODAL';
export function hideRunHistoryModal(): Action {
  return {
    type: HIDE_RUN_HISTORY_MODAL,
  };
}

/******************************** SAMPLES **********************************/

export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export function fetchSamples(): Action {
  return {
    type: FETCH_SAMPLES,
  };
}

/******************************** HELP **********************************/

export const SHOW_HELP_MODAL = 'SHOW_HELP_MODAL';
export function showHelpModal(): Action {
  return {
    type: SHOW_HELP_MODAL,
  };
}

export const HIDE_HELP_MODAL = 'HIDE_HELP_MODAL';
export function hideHelpModal(): Action {
  return {
    type: HIDE_HELP_MODAL,
  };
}

/******************************** ERROR **********************************/

export const SHOW_ERROR_MODAL = 'SHOW_ERROR_MODAL';
export function showErrorModal(action: string, error: string) {
  return {
    type: SHOW_ERROR_MODAL,
    payload: {
      errorAction: action,
      errorMessage: error,
    },
  };
}

export const HIDE_ERROR_MODAL = 'HIDE_ERROR_MODAL';
export function hideErrorModal() {
  return {
    type: HIDE_ERROR_MODAL,
  };
}

/******************************** NEW SCRIPT **********************************/

export const SHOW_NEW_SCRIPT_DIALOG = 'SHOW_NEW_SCRIPT_DIALOG';
export function showNewScriptDialog(): Action {
  return {
    type: SHOW_NEW_SCRIPT_DIALOG,
  };
}

export const HIDE_NEW_SCRIPT_DIALOG = 'HIDE_NEW_SCRIPT_DIALOG';
export function hideNewScriptDialog(): Action {
  return {
    type: HIDE_NEW_SCRIPT_DIALOG,
  };
}

export const LOAD_SAMPLE = 'LOAD_SAMPLE';
export function loadSample(sample_id: number): Action {
  return {
    type: LOAD_SAMPLE,
    payload: {
      sampleId: sample_id,
    },
  };
}

/******************************** SCRIPT **********************************/

export const CHANGE_SCRIPT_TITLE = 'CHANGE_SCRIPT_TITLE';
export function changeScriptTitle(title: string): Action {
  return {
    type: CHANGE_SCRIPT_TITLE,
    payload: {
      title: title,
    },
  };
}

export const LOAD_SCRIPT = 'LOAD_SCRIPT';
export function loadScript(script_id: string): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({
      type: LOAD_SCRIPT,
      payload: {
        id: script_id,
      },
    });
    return dispatch(fetchSchedule(script_id));
  };
}

export function previewScript(): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({type: PREVIEW_SCRIPT_REQUEST});
    return fetch(makeUrl('/schedules', get_state), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: makeFormData({
        queue_name: 'preview',
        script_id: get_state().currentScript.id,
      }, get_state),
    })
    .then((response: Response) => handleErrors(response, dispatch))
    .then((response: Response) => response.json())
    .then((content: Object) => {
      const query = {
        queue_name: 'preview',
        schedule_id: content.id,
      };
      return fetch(makeUrl('/routines', get_state, query), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then((response: Response) => handleErrors(response, dispatch))
      .then((response: Response) => response.json())
      .then((content: Object) => pollRoutine(content.data[0].id, dispatch, get_state))
      .catch((error: Error) => dispatch(showErrorModal(PREVIEW_SCRIPT_REQUEST, error.message)));
    })
    .catch((error: Error) => dispatch(showErrorModal(PREVIEW_SCRIPT_REQUEST, error.message)));
  };
}

export const PREVIEW_SCRIPT_REQUEST = 'PREVIEW_SCRIPT_REQUEST';
export const PREVIEW_SCRIPT_SUCCESS = 'PREVIEW_SCRIPT_SUCCESS';
function pollRoutine(routineId, dispatch, getState) {
  fetch(makeUrl('/routines/' + routineId, getState))
  .then((response) => handleErrors(response, dispatch))
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    dispatch({
      type: PREVIEW_SCRIPT_SUCCESS,
      payload: {
        log: response.runner_log,
        is_completed: response.is_completed,
      },
    });
    if (!response.is_completed) {
      setTimeout(function() {
        pollRoutine(routineId, dispatch, getState);
      }, 1000);
    }
  })
  .catch(excep => dispatch(showErrorModal(PREVIEW_SCRIPT_REQUEST, excep.message)));
}

export const SAVE_SCRIPT_REQUEST = 'SAVE_SCRIPT_REQUEST';
export const SAVE_SCRIPT_SUCCESS = 'SAVE_SCRIPT_SUCCESS';
export function saveScript(): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    dispatch({type: SAVE_SCRIPT_REQUEST});
    const currentScript = get_state().currentScript;
    const id = currentScript.id || '';
    return fetch('/scripts/' + id, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: makeFormData({
        code: get_state().editorValue,
        optimisations: get_state().optimisations,
        title: get_state().currentScriptTitle,
      }, get_state),
    })
    .then(response => handleErrors(response, dispatch))
    .then(response => response.json())
    .then(response => dispatch({
      type: SAVE_SCRIPT_SUCCESS,
      payload: {
        script: response,
      },
    }))
    .then(response => dispatch(loadScript(response.payload.script.id)))
    .catch(excep => dispatch(showErrorModal(SAVE_SCRIPT_REQUEST, excep.message)));
  };
}

/******************************** SCHEDULE **********************************/

export const SHOW_SCHEDULE_DIALOG = 'SHOW_SCHEDULE_DIALOG';
export function showScheduleDialog() {
  return {
    type: SHOW_SCHEDULE_DIALOG,
  };
}

export const HIDE_SCHEDULE_DIALOG = 'HIDE_SCHEDULE_DIALOG';
export function hideScheduleDialog() {
  return {
    type: HIDE_SCHEDULE_DIALOG,
  };
}

export const SET_NEW_SCHEDULE_PAUSED = 'SET_NEW_SCHEDULE_PAUSED';
export function setNewSchedulePaused(schedulePaused: bool): Action {
  return {
    type: SET_NEW_SCHEDULE_PAUSED,
    payload: {
      schedulePaused: schedulePaused,
    },
  };
}

export const SET_NEW_SCHEDULE_MINUTE = 'SET_NEW_SCHEDULE_MINUTE';
export function setNewScheduleMinute(scheduleMinute: number): Action {
  return {
    type: SET_NEW_SCHEDULE_MINUTE,
    payload: {
      scheduleMinute: scheduleMinute,
    },
  };
}

export const SET_NEW_SCHEDULE_HOUR = 'SET_NEW_SCHEDULE_HOUR';
export function setNewScheduleHour(scheduleHour: number): Action {
  return {
    type: SET_NEW_SCHEDULE_HOUR,
    payload: {
      scheduleHour: scheduleHour,
    },
  };
}

export const SET_NEW_SCHEDULE_INTERVAL = 'SET_NEW_SCHEDULE_INTERVAL';
export function setNewScheduleInterval(scheduleInterval: number): Action {
  return {
    type: SET_NEW_SCHEDULE_INTERVAL,
    payload: {
      scheduleInterval: scheduleInterval,
    },
  };
}

export const SET_NEW_SCHEDULE_DAY = 'SET_NEW_SCHEDULE_DAY';
export function setNewScheduleDay(scheduleDay: number): Action {
  return {
    type: SET_NEW_SCHEDULE_DAY,
    payload: {
      scheduleDay: scheduleDay,
    },
  };
}

export const NEW_SCHEDULE_REQUEST = 'NEW_SCHEDULE_REQUEST';
export function savingScheduleRequest(): Thunk<void> {
  return function(dispatch: Dispatch, get_state: GetState): void {
    dispatch({type: NEW_SCHEDULE_REQUEST});
    dispatch(saveSchedule());
  };
}

export const SAVE_SCHEDULE_REQUEST = 'SAVE_SCHEDULE_REQUEST';
export const SAVE_SCHEDULE_SUCCESS = 'SAVE_SCHEDULE_SUCCESS';
export function saveSchedule(): Thunk<Promise<void>> {
  return function(dispatch: Dispatch, get_state: GetState): Promise<void> {
    return dispatch(saveScript())
      .then(function() {
        dispatch({type: SAVE_SCHEDULE_REQUEST});
        const currentSchedule = get_state().newSchedule;
        const id = currentSchedule.id || '';
        return fetch(`/schedules/${id}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: makeFormData({
            is_paused: currentSchedule.is_paused,
            queue_name: 'main',
            recurrence: currentSchedule.recurrence,
            script_id: get_state().currentScript.id,
            start_time: currentSchedule.start_time,
          }, get_state),
        })
        .then(response => handleErrors(response, dispatch))
        .then(response => response.json())
        .then(function(response) {
          dispatch({
            type: SAVE_SCHEDULE_SUCCESS,
            payload: {
              schedule: response,
            },
          });
          dispatch(hideScheduleDialog());
        })
        .catch((error: Error) => dispatch(showErrorModal(SAVE_SCHEDULE_REQUEST, error.message)));
      });
  };
}

/******************************** EDITOR **********************************/

export const OPTIMISATIONS_COMPLETE = 'OPTIMISATIONS_COMPLETE';
export function optimisationComplete(optimisations: Object): Action {
  return {
    type: OPTIMISATIONS_COMPLETE,
    payload: {
      optimisations: optimisations,
    },
  };
}

export const SCRIPT_CODE_CHANGED = 'SCRIPT_CODE_CHANGED';
export function codeChanged(code: string): Action {
  return {
    type: SCRIPT_CODE_CHANGED,
    payload: {
      code: code,
    },
  };
}
