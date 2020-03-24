import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { ZoomMtg } from '@zoomus/websdk';

const API_KEY = 'N4AyKlmIQGi_Nsw4cXFtlw';
const meetingId = '814584950';

class LoginForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      console.log('checkSystemRequirements');
      console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

      // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
      // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.2/lib', '/av'); // CDN version default
      // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.2/lib', '/av'); // china cdn option 
      // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();


    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
      fetch('https://na-conference.herokuapp.com/api/zoom/'+meetingId)
        .then((response) => {
            console.log('signature', response.result);
            ZoomMtg.init({
                leaveUrl: '/',
                success() {
                    ZoomMtg.join(
                        {
                            meetingNumber: meetingId,
                            userName: this.state.value,
                            signature: response.result,
                            apiKey: API_KEY,
                            userEmail: 'email@gmail.com',
                            passWord: 1411,
                            success() {
                                //$('#nav-tool').hide();
                                console.log('join meeting success');
                            },
                            error(res) {
                                console.log(res);
                            }
                        }
                    );
                },
                error(res) {
                    console.log(res);
                }
            });
        });
      }
    }
  
    render() {
      return (
        <Form>
          <Form.Group controlId="formDisplayName" onSubmit={this.handleSubmit}>
            <Form.Label>Display Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Display Name" value={this.state.value} onChange={this.handleChange} />
            <Form.Text className="text-muted">
              You can use an anonyous name
            </Form.Text>
          </Form.Group>
            <Button variant="primary" type="submit">
             Submit
            </Button>
        </Form>
      );
    }
  }

  export default LoginForm;