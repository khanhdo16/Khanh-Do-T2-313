import React, { Component } from 'react'
import { Button, Menu } from 'semantic-ui-react'

//Header component
export default class Header extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu fluid widths={6}>
        <Menu.Item header>iService</Menu.Item>
        <Menu.Item
          name='postATask'
          active={activeItem === 'postATask'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='becomeAnExpert'
          active={activeItem === 'becomeAnExpert'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='findTasks'
          active={activeItem === 'findTasks'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='howItWorks'
          active={activeItem === 'howItWorks'}
          onClick={this.handleItemClick}
        />

        <Menu.Item>
          <Button primary>Sign in</Button>
        </Menu.Item>
      </Menu>
    )
  }
}