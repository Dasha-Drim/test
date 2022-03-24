import { LineChart as LineChartFromLibrary } from '@opd/g2plot-react';

const LineChart = (props) => {
	/* PROPS:
    props.data
    */
    
	const config = {
		height: 260,
		xField: 'date',
		yField: 'value',
		smooth: true,
		meta: {
			value: {
				max: props.max + 5,
			},
		},
		tooltip: {
			fields: ['date', 'value'],
			formatter: (data) => {
				return { name: "Количество", value: data.value };
			},
		},
		data: props.data,
	}
	return (
		<LineChartFromLibrary {...config} />
	);
}

export default LineChart;