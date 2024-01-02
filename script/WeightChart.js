function WeightChart(NumIn){
    this.color = '#888888';
    
    switch(NumIn){
        case 1:
            this.color = '#FFFF00';
            break;
        case 2:
            this.color = '#FF0000';
            break;
        case 3:
            this.color = '#00FF00';
            break;
        case 4:
            this.color = '#0000FF';
            break;
        case 5:
            this.color ='#8844FF'
            break;
        case 6:
            this.color = '#AAAA00';
            break;
        case 7:
            this.color = '#AA0000';
            break;
        case 8:
            this.color = '#00AA00';
            break;
        case 9:
            this.color = '#0000AA';
            break;
        case 10:
            this.color = '#4400AA';
            break;
        case 11:
            this.color = '#888800';
            break;
        case 12:
            this.color = '#880000';
            break;
        case 13:
            this.color = '#008800';
            break;
        case 14:
            this.color = '#000088';
            break;
        case 15:
            this.color = '#221188';
            break;
        default:
            this.color = '#888888';
            break;
    }
    return this.color;
}