import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy
  } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

declare const echarts: any;

@Component({
  selector: 'app-open-startup-chart',
  templateUrl: './open-startup-chart.component.html',
  styleUrls: ['./open-startup-chart.component.scss']
})
export class OpenStartupChartComponent implements AfterViewInit, OnDestroy {

  @Input() data: Array<{ date: Date, value: number }>;
  option: any;
  private themeSubscription: Subscription;

  constructor(private theme: NbThemeService) { }

  ngAfterViewInit(): void {
    this.themeSubscription = this.theme
      .getJsTheme()
      .pipe(delay(1))
      .subscribe(config => {
        const eTheme: any = config.variables.charts;

        this.option = {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 80,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: eTheme.tooltipLineColor,
                width: eTheme.tooltipLineWidth,
              },
            },
            textStyle: {
              color: eTheme.tooltipTextColor,
              fontSize: 20,
              fontWeight: eTheme.tooltipFontWeight,
            },
            position: 'top',
            backgroundColor: eTheme.tooltipBg,
            borderColor: eTheme.tooltipBorderColor,
            borderWidth: 3,
            formatter: '{c0} users',
            extraCssText: eTheme.tooltipExtraCss,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            offset: 25,
            data: this.data.map(i => i.date.toLocaleDateString()),
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: eTheme.xAxisTextColor,
              fontSize: 18,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
                width: '2',
              },
            },
          },
          yAxis: {
            boundaryGap: [0, '5%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: eTheme.yAxisSplitLine,
                width: '1',
              },
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              symbolSize: 20,
              itemStyle: {
                normal: {
                  opacity: 0,
                },
                emphasis: {
                  color: '#ffffff',
                  borderColor: eTheme.itemBorderColor,
                  borderWidth: 2,
                  opacity: 1,
                },
              },
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: eTheme.lineGradFrom,
                    },
                    {
                      offset: 1,
                      color: eTheme.lineGradTo,
                    }
                  ]),
                  shadowColor: eTheme.lineShadow,
                  shadowBlur: 6,
                  shadowOffsetY: 12,
                },
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: eTheme.areaGradFrom,
                    },
                    {
                      offset: 1,
                      color: eTheme.areaGradTo,
                    }
                  ]),
                },
              },
              data: this.data.map(i => i.value),
            },
            {
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: eTheme.lineGradFrom,
                    },
                    {
                      offset: 1,
                      color: eTheme.lineGradTo,
                    }
                  ]),
                  shadowColor: eTheme.shadowLineDarkBg,
                  shadowBlur: 14,
                  opacity: 1,
                },
              },
              data: this.data.map(i => i.value),
            },
          ],
        };
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}
