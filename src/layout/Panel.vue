<template>
    <!-- 这是一个布局组件 panel -->
    <div :style="{ width: formatWidth }" class="panel">
        <div class="head" :style="{ height: formatHeight }">
            <slot name="head" />
        </div>
        <div class="content">
            <slot name="content" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        width: {
            type: [String, Number],
            default: "100%",
        },
        height: {
            type: [String, Number],
            default: "40px",
        },
    },
    computed: {
        formatWidth() {
            // 先判断是否是数字，是的话直接变成加 px 的字符串，不是的话就看是否可以使用 Number 转化成数字 能的话就变成加 px 的字符串，不能的话就说明带单位了，就不用修改了
            const { width } = this;
            return typeof width === "number" || Number(width)
                ? width + "px"
                : width;
        },
        formatHeight() {
            const { height } = this;
            return typeof height === "number" || Number(height)
                ? height + "px"
                : height;
        },
    },
};
</script>

<style lang='less'>
.panel {
    width: 100%;
    // background: #fff;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 6px;
    .head {
        // height: 40px;
        // line-height: 40px;
        display: flex;
        align-items: center;
        padding: 0 10px;
    }
    .content {
        padding: 10px;
    }
}
</style>