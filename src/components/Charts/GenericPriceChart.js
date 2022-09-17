import React, {useEffect,useState} from "react";
import {Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale} from 'chart.js';
import {Line} from 'react-chartjs-2';
import Constants from "../Global/Constants";
import BlurEffect from "../GenericComponents/BlurEffect";
import '../../assets/styles.css';
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
  } from "reactstrap";

import classNames from "classnames";

ChartJS.register(
    CategoryScale,
    PointElement,
    LinearScale,
    LineElement
);

const GenericPriceChart = ({
    options
  }) =>  {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gradient, setGradient] = useState('blue');
    const [buttonActive, setButtonActive] = useState('7');

    const activateButton = (time) => {
        setButtonActive(time);
    };

    const [selectedToken, setSelectedToken] = useState('kujira');
    const [selectedTokenLabel, setSelectedTokenLabel] = useState('KUJI');
    const [selectedCurrency, setSelectedCurrency] = useState('usd');
    const [selectedDays, setSelecteDays] = useState('7');
    const [selectedInterval, setSelectedInterval] = useState('daily');

    const selectOptions = [
        {
            'value': 'kujira',
            'name': 'KUJI',
            'key': '1'
        },
        {
            'value': 'cosmos',
            'name': 'ATOM',
            'key': '2'
        },
        {
            'value': 'evmos',
            'name': 'EVMOS',
            'key': '3'
        },
        {
            'value': 'juno-network',
            'name': 'JUNO',
            'key': '4'
        },
        {
            'value': 'osmosis',
            'name': 'OSMO',
            'key': '5'
        },
        {
            'value': 'secret',
            'name': 'SCRT',
            'key': '6'
        },
        {
            'value': 'stargaze',
            'name': 'STARS',
            'key': '7'
        },
        {
            'value': 'wrapped-avax',
            'name': 'wAVAX',
            'key': '8'
        },
        {
            'value': 'weth',
            'name': 'wETH',
            'key': '9'
        },
    ];

    const handleChange = ({ target }) => {
        setSelectedToken(target.value);
        setSelectedTokenLabel(target.options[target.selectedIndex].text);
        getTokenData(target.value,selectedCurrency,selectedDays,selectedInterval);
    }


    const fromTimestampToDate = (timestamp) => {
        return new Date(timestamp).toLocaleString().slice(0,9);
    }

    const getTokenData = async (
        coin = 'kujira',
        vs_currency = 'usd',
        days = '7',
        interval = 'daily'
        ) => {

            setSelectedCurrency(vs_currency);
            setSelecteDays(days);
            setSelectedInterval(interval);
            activateButton(days);

        setLoading(true);

        let url = 'https://api.coingecko.com/api/v3/coins/'+
        coin + '/market_chart?vs_currency=' + vs_currency + '&days=' + days + '&interval=' + interval;
        
        let newArray = [];

        await fetch(url)
            .then((response) => {response.json()
            .then((json) => {
                console.log(json);
                json.prices.map((x) => {
                    let date = fromTimestampToDate(x[0]);
                    let price = parseFloat(x[1]).toFixed(3);

                    newArray.push([date,price]);
                })

                setData(newArray);
                setLoading(false);
            }).catch(error => {
                console.log(error);
            })
        });
    }

    const getGradient = () => {
        let ctx = document.querySelector('#generic-price-chart > canvas').getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 0);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return gradientStroke;
    }

    /* 
    *
    * USE EFFECT AND FETCH 
    *
    */
    useEffect(() => {
        getTokenData();
        setGradient(getGradient());
    }, []);
    /* 
    *
    * END USE EFFECT AND FETCH 
    *
    */
   

    var optionsChart = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        return label + ' $' + context.parsed.y;
                    }
                }
            }
        },
        scales: {
            yAxes:{
                grid: {
                    drawBorder: false,
                    color: "transparent",
                    zeroLineColor: "transparent"
                },
                ticks:{
                    callback: function(value, index, ticks) {
                        return '$ ' + value;
                    },
                    beginAtZero: true,
                    color: '#a0a0a0',
                    fontSize: 12,
                }
            },
            xAxes: {
                grid: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.1)",
                    zeroLineColor: "transparent"
                },
                ticks:{
                    color: '#a0a0a0',
                    fontSize: 12,
                }
            },
        },
        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
          },
        legend: {
            labels: {
                fontSize: 26,
            }
        }
    }

    var lineChart = {
        
        data: {
            labels: data?.map(x => x[0]),
            datasets: [{
                label: 'Price',
                data: data?.map(x => x[1]),
                backgroundColor: [
                    "#1e92e6",
                ],
                label: "Price",
                fill: true,
                lineTension: 0.1,
                backgroundColor: gradient,
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 2,
                borderDashOffset: 0.0,
                pointBorderColor: "rgba(75,192,192,1)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            }]
        },
        options: optionsChart
    }
    
    return (
        <>
            <div className="content  chart-container">
            <Col  className="mb-3 p-0">
                <select onChange={(e) => handleChange(e)} id="token-selector" name="token-selector" className="form-select">
                    {
                        selectOptions.map((opt) => {
                            return (
                                <option key={opt.key} value={opt.value}>{opt.name}</option>
                            )
                        })
                    }
                </select>
            </Col>
                {
                    loading && (<BlurEffect text="Loading..." />)
                }
                
                <Row>
                    
                    <Col className="pl-0 pr-0 pl-sm-3 pr-md-3">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row>
                                    
                                    <Col className="text-left" sm="6">
                                        <CardTitle tag="h3">{selectedTokenLabel}/USDC</CardTitle>
                                    </Col>
                                    <Col sm="6" className="text-right">
                                        <ButtonGroup
                                        className="btn-group-toggle float-right"
                                        data-toggle="buttons"
                                        >
                                        <Button
                                            tag="label"
                                            className={classNames("btn-simple", {
                                                active: buttonActive === "1"
                                              })}
                                            color="info"
                                            id="0"
                                            size="sm"
                                            onClick={() => getTokenData(selectedToken,'usd','1','hourly')}
                                        >
                                            <span className="chart-button-text d-sm-block d-md-block d-lg-block d-xl-block">
                                            24h
                                            </span>
                                        </Button>
                                        <Button
                                            color="info"
                                            className={classNames("btn-simple", {
                                                active: buttonActive === "7"
                                              })}
                                            id="1"
                                            size="sm"
                                            tag="label"
                                            onClick={() => getTokenData(selectedToken,'usd','7','daily')}
                                        >
                                            <span className="chart-button-text d-sm-block d-md-block d-lg-block d-xl-block">
                                            7D
                                            </span>
                                        </Button>
                                        <Button
                                            color="info"
                                            className={classNames("btn-simple", {
                                                active: buttonActive === "3"
                                              })}
                                            id="2"
                                            size="sm"
                                            tag="label"
                                            onClick={() => getTokenData(selectedToken,'usd','3','monthly')}
                                        >
                                            <span className="chart-button-text d-sm-block d-md-block d-lg-block d-xl-block">
                                            3M
                                            </span>
                                        </Button>
                                        <Button
                                            tag="label"
                                            className={classNames("btn-simple", {
                                                active: buttonActive === "12"
                                              })}
                                            color="info"
                                            id="0"
                                            size="sm"
                                            onClick={() => getTokenData(selectedToken,'usd','12','monthly')}
                                        >
                                            <span className="chart-button-text d-sm-block d-md-block d-lg-block d-xl-block">
                                            12M
                                            </span>
                                        </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                        </CardHeader>
                            <CardBody id="generic-price-chart">
                                <Line 
                                        width={400}
                                        data={lineChart.data}
                                        options={lineChart.options}
                                    />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default GenericPriceChart;