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

import type { Dispatch, State } from 'redux';

import { connect } from 'react-redux';
import {
  showHelpModal,
  showNewScriptDialog,
  showOpenScriptDialog,
} from '../actions/actions.js';
import TypeFastAppBar from '../components/TypeFastAppBar';

const mapStateToProps = (state: State, ownProps: Object): Object => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: Object): Object => {
  return {
    onNewScriptClick: (): void => {
      dispatch(showNewScriptDialog());
    },
    onOpenScriptClick: (): void => {
      dispatch(showOpenScriptDialog());
    },
    onHelpClick: (): void => {
      dispatch(showHelpModal());
    },
    onFeedbackClick: (): void => {
      window.open('https://www.messenger.com/t/958162957622543/', '_blank').focus();
    },
  };
};

const TypeFastAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(TypeFastAppBar);

export default TypeFastAppBarContainer;
