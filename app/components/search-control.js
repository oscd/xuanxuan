import React, {Component, PropTypes} from 'react';
import HTML from '../utils/html-helper';
import InputControl from './input-control';
import Icon from './icon';
import StringHelper from '../utils/string-helper';
import DelayAction from '../utils/delay-action';
import Lang from '../lang';

class SearchControl extends Component {
    static propTypes = {
        placeholder: PropTypes.any,
        changeDelay: PropTypes.number,
        onSearchChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        defaultValue: PropTypes.any,
        value: PropTypes.any,
        children: PropTypes.any,
        className: PropTypes.string,
    };

    static defaultProps = {
        placeholder: Lang.string('common.search'),
        changeDelay: 100,
        onSearchChange: null,
        onBlur: null,
        onFocus: null,
        defaultValue: null,
        value: null,
        className: null,
        children: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
            focus: false,
            empty: StringHelper.isEmpty(props.defaultValue)
        };

        if (this.props.onSearchChange) {
            this.delaySearchChangeTask = new DelayAction((searchValue) => {
                this.props.onSearchChange(searchValue);
            }, this.props.changeDelay);
        }
    }

    componentWillUnmount() {
        if (this.delaySearchChangeTask) {
            this.delaySearchChangeTask.destroy();
        }
    }

    getValue() {
        return this.state.value;
    }

    isEmpty() {
        return this.state.empty;
    }

    handleOnInputFocus = e => {
        this.setState({focus: true});
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    handleOnInputBlur = e => {
        this.setState({focus: false});
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    handleOnInputChange = value => {
        value = typeof value === 'string' ? value.trim() : '';
        this.setState({empty: StringHelper.isEmpty(value), value});
        if (this.delaySearchChangeTask) {
            this.delaySearchChangeTask.do(value);
        }
    }

    handleOnCloseBtnClick = () => {
        this.inputControl.setValue('');
        this.inputControl.focus();
    }

    render() {
        let {
            className,
            children,
            onSearchChange,
            changeDelay,
            onFocus,
            onChange,
            onBlur,
            ...other
        } = this.props;

        return (<InputControl
            className={HTML.classes('search', className, {
                focus: this.state.focus,
                empty: this.state.empty,
                normal: !this.state.focus
            })}
            label={<Icon name="search" />}
            onFocus={this.handleOnInputFocus}
            onBlur={this.handleOnInputBlur}
            onChange={this.handleOnInputChange}
            {...other}
            ref={e => {this.inputControl = e;}}
        >
            <Icon name="close" onClick={this.handleOnCloseBtnClick} className="close state" />
            {children}
        </InputControl>);
    }
}

export default SearchControl;
