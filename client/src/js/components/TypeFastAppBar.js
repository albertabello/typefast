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

import type { Element } from 'react';

import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class TypeFastAppBar extends React.Component {

  static propTypes = {
    onNewScriptClick: React.PropTypes.func,
    onOpenScriptClick: React.PropTypes.func,
    onHelpClick: React.PropTypes.func,
    onFeedbackClick: React.PropTypes.func,
  };

  render(): Element<any> {
    return (
      <AppBar
        title={"TypeFast"}
        style={{boxShadow: 'none'}}
        iconElementLeft={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon color="white" /></IconButton>
            }
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem
              leftIcon={<FontIcon className="material-icons">note_add</FontIcon>}
              primaryText="New Script"
              onClick={this.props.onNewScriptClick}
            />
            <MenuItem
              leftIcon={<FontIcon className="material-icons">description</FontIcon>}
              primaryText="Open Script"
              onClick={this.props.onOpenScriptClick}
            />
            <MenuItem
              leftIcon={<FontIcon className="material-icons">help_outline</FontIcon>}
              primaryText="Shortcuts"
              onClick={this.props.onHelpClick}
            />
            <MenuItem
              leftIcon={<FontIcon className="material-icons">feedback</FontIcon>}
              primaryText="Give Us Feedback"
              onClick={this.props.onFeedbackClick}
            />
          </IconMenu>
        }
      />
    );
  }
}

module.exports = TypeFastAppBar;
