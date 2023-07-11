export const MoveIconSvg = (props) =>{
    const {fill,background} = props;
    return (
        <>
            <svg {...props} fill={background} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.3,11.291l3-3A1,1,0,1,1,6.708,9.706L5.415,11H11V5.413L9.708,6.706A1,1,0,0,1,8.294,5.292l3-3a1,1,0,0,1,1.415,0l3,3a1,1,0,1,1-1.414,1.414L13,5.413V11h5.586L17.294,9.706a1,1,0,1,1,1.414-1.414l3,3a1,1,0,0,1,0,1.416l-3,3a1,1,0,1,1-1.414-1.414L18.587,13H13v5.586l1.293-1.293a1,1,0,0,1,1.414,1.414l-3,3a1,1,0,0,1-1.415,0l-3-3a1,1,0,0,1,1.414-1.414L11,18.585V13H5.415l1.293,1.293a1,1,0,1,1-1.414,1.414l-3-3A1,1,0,0,1,2.3,11.291Z"/>
            </svg>
        </>
    )
}
export const EditIconSvg = (props) =>{
    const {fill,background} = props;
    return (
        <>
        <svg {...props} fill="none"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.15" d="M4 20H8L18 10L14 6L4 16V20Z" />
            <path d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke={background} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </>
    )
}
export const CloseIconSvg = (props) =>{
    const {fill,background} = props;
    return (
        <>
        <svg {...props} fill={background} viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <g id="Menu / Close_SM">
            <path fill={fill} id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke={background} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </svg>
        </>
    )
}
export const AddIconSvg = (props) =>{
    const {fill,background} = props;
    return (
        <>
        <svg {...props} fill={background}  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill={fill}/>
        </svg>
        </>
    )
}