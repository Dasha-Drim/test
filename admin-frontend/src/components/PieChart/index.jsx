import { PieChart as PieChartFromLibrary } from '@opd/g2plot-react'

const PieChart = (props) => {
    /* PROPS:
    props.data
    */

    const config = {
        height: 260,
        angleField: 'value',
        colorField: 'country',
        radius: 1,
        innerRadius: 0.64,
        meta: {
            value: {
                formatter: (v) => v,
            },
        },
        tooltip: {
            fields: ['country', 'value'],
            formatter: (data) => {
                return { name: data.country, value: data.value };
            },
        },
        statistic: {
            title: {
                offsetY: -8,
                content: "Определено",
                style: {
                    fontSize: 14
                },
            },
            content: {
                offsetY: -4,
                style: {
                    fontSize: 24
                },
            },
        },
        data: props.data
    }

    return (
        <PieChartFromLibrary {...config} />
    );
}

export default PieChart;